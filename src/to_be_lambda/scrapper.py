import requests
import re
from bs4 import BeautifulSoup
import smtplib
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

product_title_target_selector = "productTitle" # this is a id of the element
product_wholePrice_target_selector = "a-price-whole" # this is a class element
product_decimalPrice_target_selector = "" # this is a class element



headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

URLS = [
    "https://www.amazon.in/boAt-Rockerz-255-Pro-Earphones/dp/B08TV2P1N8/ref=sr_1_1?_encoding=UTF8&content-id=amzn1.sym.e08c6279-844d-49c6-8e7c-3fcd4b905908&pd_rd_r=c0ff59dd-08c6-45c3-b81c-5d6cce1a7021&pd_rd_w=rHqIf&pd_rd_wg=abIuR&pf_rd_p=e08c6279-844d-49c6-8e7c-3fcd4b905908&pf_rd_r=04KJPZBAWQSB1HP84Z11&qid=1706616178&sr=8-1",
    "https://www.amazon.in/FUNDAY-FASHION-Sleeve-Womens-Jacket/dp/B084HDZTJW/ref=sr_1_2?_encoding=UTF8&content-id=amzn1.sym.74f25a9d-e850-443b-a26a-da459bed7e95&pd_rd_r=33e9b6b3-80ce-43ff-acee-9b9d1851dc21&pd_rd_w=T7KSD&pd_rd_wg=99fA3&pf_rd_p=74f25a9d-e850-443b-a26a-da459bed7e95&pf_rd_r=T3B1VXVSH07A3SKAZMXT&qid=1706616219&refinements=p_n_specials_match%3A21618256031%2Cp_85%3A10440599031%2Cp_n_feature_nineteen_browse-bin%3A11301357031&rnid=11301356031&rps=1&s=apparel&sr=1-2",
]

dream_price = [1200, 400]
from_address = "akshaysparks1995@gmail.com"
to_address = "akshaysparks125@gmail.com"
from_password = "gvxyeodellfpdhjf"
EMAIL_HOST_PASSWORD = 'gvxyeodellfpdhjf'
minutes = 1  


def check_price(URLS):
    for i in range(len(URLS)):
        page = requests.get(URLS[i], headers=headers)
        soup = BeautifulSoup(page.content, "html.parser")
        title = soup.find(id=product_title_target_selector).get_text()
        price = soup.find("span", {"class": product_wholePrice_target_selector}).getText()
        price = re.sub('[^A-Za-z0-9]+', '', price)
        print(f"{title} {int(price)}")

        if int(price) < dream_price[i]:
            print("ready to send mail")
           # send_mail_updated()

def send_mail_updated():
    msg = MIMEMultipart('alternative')
    msg['Subject'] = "Test email"
    msg['From'] = from_address
    msg['To'] = to_address

    html = """\
 We are sending an email using P2ython and Gmail, how fun! We can fill this with html, and gmail supports a decent range of css style attributes too - https://developers.google.com/gmail/design/css#example.
 """
    
    part1 = MIMEText(html, 'html')

    msg.attach(part1)

    username = 'akshaysparks1995@gmail.com'  
    password = 'gvxyeodellfpdhjf'

    server = smtplib.SMTP('smtp.gmail.com', 587) 
    server.ehlo()
    server.starttls()
    server.login(username,password)  
    server.sendmail(from_address, to_address, msg.as_string())  
    server.quit()



# while True:
#     check_price()
#     print("_"*100)
#     time.sleep(60 * minutes)
