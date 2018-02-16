import oauth2
import sys

def oauth_req(hashtag, key, secret, http_method="GET", post_body="", http_headers=None):
    consumer = oauth2.Consumer(key="FuJYcN2RAFeCEbSj3ZD6muF8m", secret="1l1lST8twVgqrlPpvY3RWvloDxffIvsSNhuVt1d947ng6NZo1e")
    token = oauth2.Token(key=key, secret=secret)
    client = oauth2.Client(consumer, token)
    resp, content = client.request( 'https://api.twitter.com/1.1/search/tweets.json?q=%23' + str(hashtag), method=http_method, body=post_body, headers=http_headers )
    return content

pledge_timeline = oauth_req( sys.argv[1], '953801539541336065-YZKblUs6CjMFJujY0FrPuTkAYekBmO3', 'sfXNoaqpAunilXTYcCXxd62W1PlJ8yNQWqetk2Oj4HgPn' )

print(str(pledge_timeline))
