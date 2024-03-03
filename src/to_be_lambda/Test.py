import requests
import re
import random
from bs4 import BeautifulSoup
import smtplib
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import json

with open('scrapingData.json', 'r') as f:
    scraperData = json.load(f)

user_rotate = [
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15"
"Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15"
]


headers = {
    "User-Agent": user_rotate[random.randrange(0,6)]
}


def bahraingreetings(company,URL):

    companyScrapParam = scraperData[company]

    page = requests.get(URL, headers=headers)
    soup = BeautifulSoup(page.content, "html.parser")

    title = soup.select(companyScrapParam["Target_ProductName_Remarks"]
                        +"[class='"+companyScrapParam["Target_ProductName"]+"']")[0].get_text()
    title = title.strip()
    whole_price =  soup.select(companyScrapParam["Target_Price_Remarks"]
                               +"[class='"+companyScrapParam["Target_Price"]+"']")[1].get_text()
    
    price_symbol = whole_price.split()[0]
    whole_price = whole_price.split()[1]

    return (title,price_symbol, whole_price)

def dukakeen(company,URL):
    companyScrapParam = scraperData[company]


    page = requests.get(URL, headers=headers)
    soup = BeautifulSoup(page.content, "html.parser")

    title = soup.select(companyScrapParam["Target_ProductName_Remarks"]
                        +"[class='"+companyScrapParam["Target_ProductName"]+"']")[0].get_text()
    title = title.strip()
    whole_price =  soup.select(companyScrapParam["Target_Price_Remarks"]
                               +"[class='"+companyScrapParam["Target_Price"]+"']")[1].get_text()
    
    price_symbol = "BD"
    whole_price = whole_price.replace("BD","")
    
    return (title,price_symbol, whole_price)

def livewell(company,URL):
    companyScrapParam = scraperData[company]

    page = requests.get(URL, headers=headers)
    soup = BeautifulSoup(page.content, "html.parser")

    title = soup.select(companyScrapParam["Target_ProductName_Remarks"]
                        +"[class='"+companyScrapParam["Target_ProductName"]+"']")[0].get_text()
    title = title.strip()
    whole_price =  soup.select(companyScrapParam["Target_Price_Remarks"]
                               +"[class='"+companyScrapParam["Target_Price"]+"']")[1].get_text()
        
    price_symbol = "BD"
    whole_price = whole_price.replace("BD","")
    
    return (title,price_symbol, whole_price)

def luluhypermarket(company,URL):
    companyScrapParam = scraperData[company]

    page = requests.get(URL, headers=headers)
    soup = BeautifulSoup(page.content, "html.parser")

    title = soup.select(companyScrapParam["Target_ProductName_Remarks"]
                        +"[class='"+companyScrapParam["Target_ProductName"]+"']")[0].get_text()
    title = title.strip()

    whole_price =  soup.select(companyScrapParam["Target_Price_Remarks"]
                               +"[class='"+companyScrapParam["Target_Price"]+"']")[0].get_text()
        
    price_symbol = "BHD"
    whole_price = whole_price.replace("BHD","").strip()
    
    return (title,price_symbol, whole_price)

def namshi(company,URL):
    companyScrapParam = scraperData[company]

    page = requests.get(URL, headers=headers)
    soup = BeautifulSoup(page.content, "html.parser")

    title = soup.select(companyScrapParam["Target_ProductName_Remarks"]
                        +"[class='"+companyScrapParam["Target_ProductName"]+"']")[0].get_text()
    title = title.strip()

    whole_price =  soup.select(companyScrapParam["Target_Price_Remarks"]
                               +"[class='"+companyScrapParam["Target_Price"]+"']")[0].get_text()
        
    price_symbol = "BHD"
    whole_price = whole_price.replace("BHD","").strip()
    
    return (title,price_symbol, whole_price)

def nextdirect(company,URL):
    companyScrapParam = scraperData[company]

    page = requests.get(URL, headers=headers)
    soup = BeautifulSoup(page.content, "html.parser")

    title = soup.select(companyScrapParam["Target_ProductName_Remarks"]
                        +"[class='"+companyScrapParam["Target_ProductName"]+"']")[0].get_text()
    title = title.strip()

    whole_price =  soup.select(companyScrapParam["Target_Price_Remarks"]
                               +"[class='"+companyScrapParam["Target_Price"]+"']")[0].get_text()
        
    price_symbol = "BD"
    whole_price = whole_price.replace("BD","").strip().split('-')
    whole_price = whole_price[len(whole_price) -1].strip()
    
    return (title,price_symbol, whole_price)

def ootlah(company,URL):
    companyScrapParam = scraperData[company]

    page = requests.get(URL, headers=headers)
    soup = BeautifulSoup(page.content, "html.parser")

    title = soup.select(companyScrapParam["Target_ProductName_Remarks"]
                        +"[id='"+companyScrapParam["Target_ProductName"]+"']")[0]
    title = title.find_next_sibling().select("h1")[0].get_text()

    whole_price =  soup.select(companyScrapParam["Target_Price_Remarks"]
                              +"[id='"+companyScrapParam["Target_Price"]+"']")[0].get_text()
        
    price_symbol = "BHD"
    whole_price = whole_price.replace("BHD","").strip()
    
    return (title,price_symbol, whole_price)

def ounass(company,URL):
    companyScrapParam = scraperData[company]

    page = requests.get(URL, headers=headers)
    soup = BeautifulSoup(page.content, "html.parser")

    title = soup.select(companyScrapParam["Target_ProductName_Remarks"]
                        +"[class='"+companyScrapParam["Target_ProductName"]+"']")[0].get_text()
    
    whole_price =  soup.select(companyScrapParam["Target_Price_Remarks"]
                              +"[class='"+companyScrapParam["Target_Price"]+"']")[0].get_text()
        
    price_symbol = "BHD"
    whole_price = whole_price.replace("BHD","").strip()
    
    return (title,price_symbol, whole_price)

def sharafdg(company,URL):
    companyScrapParam = scraperData[company]

    page = requests.get(URL, headers=headers)
    soup = BeautifulSoup(page.content, "html.parser")

    title = soup.select(companyScrapParam["Target_ProductName_Remarks"]
                        +"[class='"+companyScrapParam["Target_ProductName"]+"']")[0].get_text()
    
    whole_price =  soup.select(companyScrapParam["Target_Price_Remarks"]
                               +"[class='"+companyScrapParam["Target_Price"]+"']")[0].get_text()
        
    price_symbol = "BHD"
    
    return (title,price_symbol, whole_price)


def manual_switch(host,URL):
    if host == "bahraingreetings":
        return bahraingreetings(host,URL)
    elif host == "dukakeen":
        return dukakeen(host,URL)
    elif host == "livewell":
        return livewell(host,URL)
    elif host == "luluhypermarket":
        return luluhypermarket(host,URL)
    elif host == "namshi":
        return namshi(host,URL)
    elif host == "nextdirect":
        return nextdirect(host,URL)
    elif host == "ootlah":
        return ootlah(host,URL)
    elif host == "ounass":
        return ounass(host,URL)
    elif host == "sharafdg":
        return sharafdg(host,URL)





# from_address = "akshaysparks1995@gmail.com"
# to_address = "akshaysparks125@gmail.com"
# from_password = "gvxyeodellfpdhjf"
# EMAIL_HOST_PASSWORD = 'gvxyeodellfpdhjf'
# minutes = 1  


def check_price(URLS, dream_price):

    for i in range(len(URLS)):

        host = re.sub("www.","", (re.search("(?<=https://)(www.)?[^.]+", URLS[i]).group()))

        if(host == "bahrain"):
            host = re.sub("www.","", re.search("(?<=https://)(www.)?[^.]+", re.sub("bahrain.","",URLS[i])).group())

        title,price_symbol,whole_price = manual_switch(host,URLS[i])

        print(f"{title} - {price_symbol} {whole_price}")

        # if int(price) < dream_price[i]:
        #     print("ready to send mail")
        #     send_mail_updated()

# def send_mail_updated():
#     msg = MIMEMultipart('alternative')
#     msg['Subject'] = "Test email"
#     msg['From'] = from_address
#     msg['To'] = to_address

#     html = """\
#  We are sending an email using P2ython and Gmail, how fun! We can fill this with html, and gmail supports a decent range of css style attributes too - https://developers.google.com/gmail/design/css#example.
#  """
    
#     part1 = MIMEText(html, 'html')

#     msg.attach(part1)

#     username = 'akshaysparks1995@gmail.com'  
#     password = 'gvxyeodellfpdhjf'

#     server = smtplib.SMTP('smtp.gmail.com', 587) 
#     server.ehlo()
#     server.starttls()
#     server.login(username,password)  
#     server.sendmail(from_address, to_address, msg.as_string())  
#     server.quit()


# while True:
#     check_price()
#     print("_"*100)
##     time.sleep(60 * minutes)

check_price(
    ["https://www.ubuy.com.bh/en/product/FSFFUGH48-pre-loved-black-gold-premiere-watch-large-black"]
     ,[1200.00])
