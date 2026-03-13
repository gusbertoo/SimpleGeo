from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from .models import Admins, Datasets, Geodata

import geopandas as gpd
import pandas as pd
from io import BytesIO
import json

def getDatasets(request):
    data = list(Datasets.objects.filter(public='True').order_by('title').values())
    #data = list(Datasets.objects.values())
    return JsonResponse(data, safe=False)
    
def getGeodata(request, id):
    data = list(Geodata.objects.filter(geodata_id=id).values())
    return JsonResponse(data, safe=False)
    
def getGeodatas(request):
    data = list(Geodata.objects.order_by('name').values())
    return JsonResponse(data, safe=False)

def getDataset(request, id):
    data = list(Datasets.objects.filter(set_id=id).values())
    return JsonResponse(data, safe=False)
    
@csrf_exempt # not ideal, opens door for csrf attacks https://stackoverflow.com/questions/6800894/django-returns-403-error-when-sending-a-post-request
def addDataset(request):
    title_ = request.POST.get('title')
    desc_ = request.POST.get('desc')
    #file_ = request.FILES.get('file').read()
    data_ = json.loads(request.POST.get('data'))
    geo_ = request.POST.get('geo')
    
    dataset_ = Datasets(username=Admins('goose'), title=title_, description=desc_, dataset=data_, public=1)
    dataset_.save()
    
    return JsonResponse(data_, safe=False)
    
@csrf_exempt
def getFile(request):
    file_ = request.FILES.get('file').read()
    accepted = ['application/json', 'application/geo+json','text/csv']
    content_type  = request.FILES.get('file').content_type
    
    if content_type in accepted:
        if content_type == 'application/json' or content_type == 'application/geo+json':
            df = pd.read_json(BytesIO(file_))
            if 'type' in df.iloc[0] and df.iloc[0]['type'] == 'FeatureCollection':
                props = df['features'].map(lambda x: x['properties'])
                return JsonResponse({'data': props.to_list(), 'geo': json.loads(file_)}, safe=False)

        elif content_type == 'text/csv':
            df = pd.read_csv(BytesIO(file_))
            data = json.loads(df.to_json(orient='records'))
            return JsonResponse({
                'data': data,
                'geo': None
            })
            
        return JsonResponse({'data': df.to_dict(orient='records'), 'geo': None}, safe=False)

@csrf_exempt
def login(request):
    user = request.POST.get('user')
    password = request.POST.get('password')
    response = (Admins.objects.filter(username=user) | Admins.objects.filter(email=user)).filter(password=password).values()
    print(response)
    return HttpResponse('<p>nivdk</p>')
