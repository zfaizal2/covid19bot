import tweepy
import requests
import datetime
import asyncio
from datetime import timedelta
from dateutil.parser import *

URL = "https://api.covid19api.com/webhook"
data = {"URL":"https://api.covid19api.com/webhook"}

# async def req():
#     response = requests.post(url = URL, data = data)
#     
#     JSON = response.get_json()
#     return response
# print(asyncio.run(req()))

today = datetime.datetime.now().date()
print(today)

response = requests.get("https://api.covid19api.com/summary")
JSON = response.json()

print(isoparse(JSON.get("Date")).date())
print(isoparse(JSON.get("Date")).time())

newCases = 0
for i in JSON['Countries']:
   
    #print(i['NewConfirmed'])
    newCases += i['NewConfirmed']
print(newCases)
caseToday ="As of {0} there are {1} new cases of COVID-19.".format(str(today), newCases)

print(caseToday)
# for i in range(len(JSON)):
#     #print(isoparse(JSON[i].get("Date")).date())
#     if today == isoparse(JSON[i].get("Date")).date():
#         a +=1
#         #print(JSON[i].get("Country"))
