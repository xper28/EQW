# -*- coding: utf-8 -*-

import os
from flask import Flask, jsonify
import sqlalchemy
import time 

class bucket:
  def __init__(self, rate, time_unit):
    self.rate = rate
    self.time_unit = time_unit
    #Initialize bucket allowance with max tokens
    self.allowance = rate
    #Initialize checkpoint timestamp indicating last time check has been performed
    self.checkpoint = time.time()
    
  def rate_limiter(self):
    curr = time.time()
    time_elapsed = curr - self.checkpoint
    self.checkpoint = curr
    
    self.allowance +=  time_elapsed * (self.allowance / self.time_unit)
    print(self.allowance)
    #If allowance exceeds max allowable rate, reset to rate
    if(self.allowance > self.rate):
      self.bucket = self.rate
    
    if(self.allowance < 1):
      return False
    else:
      self.allowance = self.allowance - 1
      return True
# web app
app = Flask(__name__, static_folder='./eqworks/build', static_url_path='/')

# database engine
engine = sqlalchemy.create_engine(os.getenv('postgresql://readonly:w2UIO@#bg532!@work-samples-db.cx4wctygygyq.us-east-1.rds.amazonaws.com:5432/work_samples'))

# variables for rate limiters
rate = 2
time_unit = 5

@app.route('/')
def index():
    return app.send_static_file('index.html')

ehourly_bucket = bucket(rate, time_unit)
@app.route('/events/hourly')
def events_hourly():
    if(ehourly_bucket.rate_limiter() == True):
        return queryHelper('''
            SELECT date, hour, events
            FROM public.hourly_events
            ORDER BY date, hour
            LIMIT 168;
        ''')
    else:
        return 'Limit of {} requestes in {} seconds exceeded'.format(rate, time_unit)

edaily_bucket = bucket(rate, time_unit)
@app.route('/events/daily')
def events_daily():
    if(edaily_bucket.rate_limiter() == True):
        return queryHelper('''
            SELECT date, SUM(events) AS events
            FROM public.hourly_events
            GROUP BY date
            ORDER BY date
            LIMIT 7;
        ''')
    else:
        return 'Limit of {} requestes in {} seconds exceeded'.format(rate, time_unit)

shourly_bucket = bucket(rate, time_unit)
@app.route('/stats/hourly')
def stats_hourly():
    if(shourly_bucket.rate_limiter() == True):
        return queryHelper('''
            SELECT date, hour, impressions, clicks, revenue
            FROM public.hourly_stats
            ORDER BY date, hour
            LIMIT 168;
        ''')
    else:
        return 'Limit of {} requestes in {} seconds exceeded'.format(rate, time_unit)

sdaily_bucket = bucket(rate, time_unit)
@app.route('/stats/daily')
def stats_daily():
    if(sdaily_bucket.rate_limiter()):
        return queryHelper('''
            SELECT date,
                SUM(impressions) AS impressions,
                SUM(clicks) AS clicks,
                SUM(revenue) AS revenue
            FROM public.hourly_stats
            GROUP BY date
            ORDER BY date
            LIMIT 7;
        ''')
    else:
        return 'Limit of {} requestes in {} seconds exceeded'.format(rate, time_unit)

poi_bucket = bucket(rate, time_unit)
@app.route('/poi')
def poi():
    if(poi_bucket.rate_limiter()):
        return queryHelper('''
            SELECT *
            FROM public.poi;
        ''')
    else:
        return 'Limit of {} requestes in {} seconds exceeded'.format(rate, time_unit)

cd_bucket = bucket(rate, time_unit)
@app.route('/combined_data')
def cd():
    if(cd_bucket.rate_limiter()):
        return queryHelper('''
            select *
from 
(SELECT date,poi_id, SUM(events) AS events
            FROM public.hourly_events
            GROUP BY date, poi_id 
            ORDER BY date
            LIMIT 10) events
full outer join
(SELECT date,poi_id,
                SUM(impressions) AS impressions,
                SUM(clicks) AS clicks,
                SUM(revenue) AS revenue
            FROM public.hourly_stats
            GROUP BY date, poi_id 
            ORDER BY date
            LIMIT 10) stats
using(date, poi_id)
inner join 
(select name, poi_id
from public.poi p
limit 10) poi
using(poi_id)
order by date
        ''')
    else:
        return 'Limit of {} requestes in {} seconds exceeded'.format(rate, time_unit)

cd_geo_bucket = bucket(rate, time_unit)
@app.route('/combined_data/geo')
def cd_geo():
    if(cd_geo_bucket.rate_limiter()):
        return queryHelper('''
            SELECT *
            FROM public.poi
            INNER JOIN (SELECT date,poi_id ,
                SUM(impressions) AS impressions,
                SUM(clicks) AS clicks,
                SUM(revenue) AS revenue
            FROM public.hourly_stats
            GROUP BY date, poi_id 
            ORDER BY date
            LIMIT 20)  stats
            ON public.poi.poi_id = stats.poi_id
            LIMIT 20
        ''')
    else:
        return 'Limit of {} requestes in {} seconds exceeded'.format(rate, time_unit)

def queryHelper(query):
    with engine.connect() as conn:
        result = conn.execute(query).fetchall()
        return jsonify([dict(row.items()) for row in result])