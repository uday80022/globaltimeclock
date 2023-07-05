from django.shortcuts import render
import json
from .models import CustomTime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return render(request,'index.html')     #   display the index.html file in frontend 



@csrf_exempt
def save_custom_time(request):      #   gets the custom entered time data from the input fields save to the database
    if request.method == "POST":   
        payload = json.loads(request.body)
        custom_time = payload.get("customTime")
        if custom_time:
            custom_time_obj = CustomTime.objects.create(time=custom_time)
            return JsonResponse({"status": "success", "message": "Custom time saved successfully."})
        else:
            return JsonResponse({"status": "error", "message": "Invalid custom time."})
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method."})
