from django.http import JsonResponse
import sqlite3
import json
import os
import urllib.request
import base64

def logon(request):
    if request.method=='POST':
        req = json.loads(request.body)
        usrname = req['usrname']
        password = req['password']
        video_link = req['video']

        filename = './data/'+usrname+'.mov'
        urllib.request.urlretrieve(video_link, "./test.jpg")
        with open(filename,'wb') as f:
            f.write(video)

        conn = sqlite3.connect('test.db')
        c = conn.cursor()

        c.execute("INSERT INTO COMPANY (NAME,PASSWORD,PATH) VALUES(\'"
            + usrname + "\', \'" + password + "\', \'" + filename + "\');")

        conn.commit()
        conn.close()
        return JsonResponse(data={'res':"OK"})

def login(request):
    if request.method=='POST':
        req = json.loads(request.body)
        usrname = req['usrname']
        password = req['password']

        conn = sqlite3.connect('test.db')
        c = conn.cursor()

        cursor = c.execute("SELECT * FROM COMPANY WHERE NAME=\'"
            + usrname + "\';")

        for i in cursor:
            if password == i[1]:
                JsonResponse(data={'res':"OK"})
            else:
                JsonResponse(data={'res':"404"})

        conn.close()
        return JsonResponse({'res':"404"})

def convert(request):
    if request.method=='POST':
        req = json.loads(request.body)
        usrname = req['usrname']
        image_link = req['image']
        import time
        i = time.time()
        struct_time = time.gmtime(i)
        filename = ('%02d%02d' % (struct_time.tm_min, struct_time.tm_sec) ) + usrname + '.jpg'
        urllib.request.urlretrieve(image_link , '../deepfakes/input/' + filename)
        # with open('../deepfakes/input/' + filename, 'wb') as f:
        #     f.write(image)
        os.chdir("../deepfakes/")
        if usrname == "admin":
            os.system('python faceswap.py convert -m models')
        elif usrname == "test":
            os.system('python faceswap.py convert -m models -s')
        elif usrname == "junlin":
            os.system('python faceswap.py convert -m modelsjlfine')
        elif usrname == "shiyi":
            os.system('python faceswap.py convert -m modelshsyfine')
        os.chdir("../www")
        os.remove("../deepfakes/input/"+filename)
        with open('../deepfakes/output/' + filename, 'rb') as f:
            tmp = base64.b64encode(f.read())
            base64_string = tmp.decode('utf-8')
            return JsonResponse({'res':"OK", 'file':base64_string})

        return JsonResponse({'res':"404"})
