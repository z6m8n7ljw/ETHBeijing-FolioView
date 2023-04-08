from flask import Flask, jsonify, request
import random
from flask_cors import CORS
import requests
import tweepy
from tweepy import OAuthHandler
from portfolio import *
from risk_eval import *


app = Flask(__name__)
CORS(app)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}

#Credentials from twitter developer account to fetch the required data
consumer_key = "uJUfRK2GdxfdqOyo43RWmkCbd"
consumer_secret = "sK6WNrfYZKBhFKXyneWv6URESMwq7GwcLbKQER1D7B50WSkwdj"
access_key = "2551921020-ZkWwPqeqRgtJtESKnd5nnAWbVa12oK56WT1zBEB"
access_secret = "PIKiOs0eewDKqsaKiPqQ99L7lrYCqa9clrqm5QMrqrX0m"
access_token='2551921020-ZkWwPqeqRgtJtESKnd5nnAWbVa12oK56WT1zBEB'
access_token_secret='PIKiOs0eewDKqsaKiPqQ99L7lrYCqa9clrqm5QMrqrX0m'

#Authentication for the credentials
auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token( access_token, access_token_secret)

#Accessing twitter api
api = tweepy.API(auth, wait_on_rate_limit=True)

#Write the username you want to search for
username = "0xAA_Science"

#Write the keyword you want to search for
keyword = "eth"

#Write the keyword you want to search for with given date range
# keyword = "eth since:2023-04-05 until:2023-01-01"

#Enter the number of tweets you want to fetch
no_of_tweets = 50


@app.route('/token_id', methods=['POST'])
def token_id():
    json_dict = request.get_json()
    risk, beta = risk_eval(json_dict)
    return jsonify({'result1': risk, 'results2': beta})


@app.route('/coins/market_chart', methods=['GET'])
def get_market_chart():
    url = "https://api.coingecko.com/api/v3/coins/" + request.args.get('coinid', 'ethereum') + "/market_chart"

    response = requests.get(url, params=request.args, headers=headers)
    return response.json()


@app.route('/portf', methods=['POST'])
def portf():
    json_dict = request.get_json()
    percent_list, metric_list = portfolio(json_dict)
    return {'result1': percent_list, 'result2': metric_list}


@app.route('/twitter', methods=['GET'])
def getTwiitters():
    #Will fetch the user details
    # tweets = api.user_timeline(screen_name=username, count=no_of_tweets)

    #Will search for entered keyword
    tweets = api.search_tweets(q="(eth OR matic OR sol OR bsc) (from:0xAA_Science OR from:BTW_0205　OR from:BTCdayu　OR from:Dahuzi＿eth　OR from:hebi555 OR from:jianshubiji)", count=no_of_tweets )

    #We can directly pass the keyword in the parameter and can give the date range
    # tweets = api.search_tweets("eth", count=no_of_tweets, until ="2023-02-23")

    return jsonify({'results': tweets[0]._json})


@app.route('/news', methods=['GET'])
def getNews():
    source1 = 'https://www.panewslab.com/webapi/search/home?LId=1&page=1&tw=0&size=10&type=2&keyword=' + request.args.get(
        'type', 'eth')
    source2 = 'https://api.theblockbeats.info/v3/Search/all?type=1&start_time=&end_time=&sort=1&keyword=' + request.args.get(
        'type', 'eth')
    response1 = requests.get(source1, headers=headers).json()
    response2 = requests.get(source2, headers=headers).json()
    data1 = list(map(lambda x: {key: value for key, value in x.items() if key in ['desc', 'id', 'title', 'img']},
                     response1["data"]["flashNews"]))
    data2 = list(
        map(lambda x: {key: value for key, value in x.items() if key in ['content', 'id', 'title', 'topic_pic']},
            response2["data"]["flashlist"]))
    for item in data1:
        item['url'] = 'https://www.panewslab.com/zh/articledetails/' + item['id'] + '.html'
    for item in data2:
        item['desc'] = item['content']
        item['url'] = 'https://www.theblockbeats.info/news/' + str(item['id'])
        del item['content']

    return jsonify({'result': data1 + data2})
    # return jsonify({'result': response1, 'result2': response2, 'result3': response3})


if __name__ == '__main__':
    app.debug = True
    app.run(port=5000)
