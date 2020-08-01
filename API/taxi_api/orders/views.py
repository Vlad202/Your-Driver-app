from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from signSystem.models import UserPhone

class GetTaxi(APIView):
    def post(self, request):
        try:
            token = request.POST['token']
            address = request.POST['address']
        except:
            return Response({'error': 'unexpected token key'})
        try:
            user = UserPhone.objects.get(token=token)
        except:
            return Response({'error': 'invalid token'})
        return Response({
            'status': 'ok',
            'message': 'Your request has been processed successfully.',
            'address': {'address': address, 'token': token},
        })