import requests
from django.http import JsonResponse, StreamingHttpResponse
from django.shortcuts import render, redirect
from django.views import View


def home(request):
    return render(request, 'app.html')


class CheckHelmet(View):
    @staticmethod
    def post(request):
        files = {'file': request.FILES['file'].read()}

        res = requests.post("http://localhost:8000/api/check", files=files)
        wearing_helmet = str(res.json()['wearingHelmet'])

        if wearing_helmet == "1":
            return JsonResponse({'available': "1"})
        else:
            return JsonResponse({'available': "0"})

    @staticmethod
    def get(request):
        return render(request, 'check2.html')


MAX_PENALTY_COUNT = 3
no_helmet_penalty_count = 0


class RideAvailable(View):
    @staticmethod
    def post(request):
        files = {'file': request.FILES['file'].read()}

        res = requests.post("http://localhost:8000/api/check", files=files)
        # return Stre
        # wearing_helmet = str(res.json()['wearingHelmet'])
        #
        # global no_helmet_penalty_count, MAX_PENALTY_COUNT
        # if wearing_helmet == "1":
        #     no_helmet_penalty_count = 0
        # else:
        #     no_helmet_penalty_count += 1
        #
        # if no_helmet_penalty_count >= MAX_PENALTY_COUNT:
        #     print('킥보드를 더 이상 이용할 수 없습니다')
        #     return JsonResponse({'penalty': f"{no_helmet_penalty_count}/{MAX_PENALTY_COUNT}", 'available': "0"})
        #
        # return JsonResponse({'penalty': f"{no_helmet_penalty_count}/{MAX_PENALTY_COUNT}", 'available': "1"})

    @staticmethod
    def get(request):
        global no_helmet_penalty_count
        no_helmet_penalty_count = 0
        return render(request, 'ride.html')


class RideUnavailable(View):
    @staticmethod
    def get(request):
        return render(request, 'unavailable.html')
