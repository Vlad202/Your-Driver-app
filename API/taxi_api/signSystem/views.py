from django.shortcuts import render
from django.contrib.auth.models import User
from .models import UserPhone
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from django.core.cache import cache
import random
from django.contrib.auth.models import User
import json
import hashlib
from django.contrib.auth import authenticate

class SignUpView(APIView):
    def post(self, request):
        try:
            name = request.POST['name']
            phone = request.POST['phone']
            password = request.POST['password']
        except:
            return Response({'error': 'incorrect data'}, status=400)
        try:
            UserPhone.objects.get(mobile_phone=phone)
            return Response({'error': 'account is already created'}, status=403)
        except:
            pass
        if '+' in phone:
            return Response({'error': 'bad phone'}, status=400)
        accept_code = random.randint(1000, 9999)
        # response = requests.get('https://api.mobizon.ua/service/message/sendsmsmessage?recipient='+ str(phone) +'&text='+ str(accept_code) +'&apiKey=ua05ca443df73fb832f0d58a594568215c79de8b3fb9e9273b3950173549988c719026')
        if True:
            cache_data = {
                'code': accept_code,
                'name': name,
                'phone': phone,
                'password': password
            }
            cache.set(phone, cache_data, timeout=300)
            print(cache.get(phone))
            return Response({'ok': cache_data}, status=202)
        return Response({'error': 'incorrect data for sms'}, status=400)

class AcceptCode(APIView):
    def post(self, request):
        try:
            phone = request.POST['phone']
            accept_code = request.POST['accept_code']
        except:
            return Response({'error': 'incorrect data'}, status=400)
        cache_data = cache.get(phone)
        if str(cache_data['code']) == str(accept_code):
            cache.delete(phone)
            user = User.objects.create_user(username=cache_data['phone'], first_name=cache_data['name'], password=cache_data['password'])
            user.save()
            hash_token = hashlib.sha256(str(str(cache_data['phone']) + str(cache_data['password']) + 'salt323').encode('utf-8')).hexdigest()
            phone_model = UserPhone(user=user, token=hash_token, mobile_phone=cache_data['phone'])
            phone_model.save()
            return Response({'message': 'user was gegistered', 'phone': cache_data['phone'], 'token': hash_token}, status=201)
        return Response({'False': cache_data}, status=403)

class SignInView(APIView):
    def post(self, request):
        try:
            phone = request.POST['phone']
            password = request.POST['password']
        except:
            return Response({'error': 'invalid data'}, status=400)
        print(phone)
        print(password)
        user = authenticate(username=str(phone), password=str(password))
        print(user)
        if user is not None:
            try:
                token = UserPhone.objects.get(user=user).token
            except:
                return Response({'error': 'incorrect data'}, status=403)
            response = {
                'phone': phone,
                'token': token
            }
            return Response(response, status=202)
        return Response({'error': 'user is not found'}, status=404)

class ResetPasswordConfirm(APIView):
    def post(self, request):
        try:
            phone = request.POST['phone']
            password = request.POST['password']
        except:
            return Response({'error': 'invalid data'})
        try:
            user = UserPhone.objects.get(mobile_phone=phone)
        except:
            return Response({'error': 'user is not found'})
        accept_code = random.randint(1000, 9999)
        try:
            response = requests.get('https://api.mobizon.ua/service/message/sendsmsmessage?recipient='+ str(phone) +'&text='+ str(accept_code) +'&apiKey=ua05ca443df73fb832f0d58a594568215c79de8b3fb9e9273b3950173549988c719026')
        except:
            return Response({'error': 'bad request, can`t send sms'})
        if response.status_code == 200:
            cache_data = {
                'code': accept_code,
                'password': password,
            }
            cache.set(phone, cache_data, timeout=300)
            return Response({'ok': accept_code})
        return Response({'error': 'can`t reset password, try again'})

class ResetPassword(APIView):
    def post(self, request):
        try:
            phone = request.POST['phone']
            code = request.POST['accept_code']
        except:
            return Response({'error': 'invalid data'})
        cache_data = cache.get(phone)
        if cache_data is not None:
            try:
                user = UserPhone.objects.get(mobile_phone=phone)
            except:
                return Response({'error': 'invalid phone number'})
            user.user.set_password(cache_data['password'])
            return Response({'ok': 'password is was reset'})
        return Response({'error': 'time is left or you did not send sms'})