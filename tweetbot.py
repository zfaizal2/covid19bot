import tweepy
import requests
import csv
import pycountry

countries = []
with open('country-keyword-list.csv', 'r', encoding='utf8') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader: # each row is a list
        #print(row[0])
        countries.append(row[0])
#print(countries)

# response = requests.get("https://api.covid19api.com/all")
# JSON = response.json()
# for i in range(len(JSON)):
#     print(JSON[i].get("Cases"))
    
#Authenticate to Twitter
auth = tweepy.OAuthHandler("ktaRTiwrzGNw7bPam9Ntk12nS", 
    "8GAFYeFMlgitZPx6S05Bd210wjOkwPkDe8QcnBzbin2gDawQEa")
auth.set_access_token("1238708239199621122-IPRvCigKFc24UKeHf6RxjhcYa3Ks5L", 
    "GYnFprdzHLCiK2jGrHYqOHL0z6zGLMm4zVUQZZe3QmwUJ")

api = tweepy.API(auth)

try:
    api.verify_credentials()
    print("Authentication OK")
except:
    print("Error during authentication")

def replies():
    reply = api.mentions_timeline()[0]
    print(reply._json['text'])
    c = "US"
    for country in pycountry.countries:
        if country.name in reply._json['text']:
            country = country.name
    print(c)
    res = requests.get("https://api.covid19api.com/total/country/{0}/status/{1}".format(c,"confirmed"))
    print("https://api.covid19api.com/total/country/{0}/status/{1}".format(c,"confirmed"))
    print(res.json())
replies()
