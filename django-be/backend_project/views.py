from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponse, JsonResponse
from .models import Dataset, PresetGeo
from django.db.models import F

import pandas as pd
from io import BytesIO
import json

def getDatasets(request):
    data = list(Dataset.objects.filter(public='True').order_by('title').values('set_id','dataset','title','description','upload','update','update','user__username'))
    #data = list(Datasets.objects.values())
    return JsonResponse(data, safe=False)
    
def getGeodata(request, id):
    data = list(PresetGeo.objects.filter(geodata_id=id).values())
    return JsonResponse(data, safe=False)
    
def getGeodatas(request):
    data = list(PresetGeo.objects.order_by('name').values())
    return JsonResponse(data, safe=False)

def getDataset(request, id):
    data = list(Dataset.objects.filter(set_id=id).values('set_id','dataset','title','description','upload','update','update','public','user__username'))
    return JsonResponse(data, safe=False)

@csrf_exempt
@require_POST
def addDataset(request):
    username = request.POST.get('username')
    title = request.POST.get('title')
    desc = None if request.POST.get('desc') == '' else request.POST.get('desc')
    dataset = request.POST.get('dataset')
    public = True if request.POST.get('public') == 'true' else False
    preset = int(request.POST.get('preset'))
    try:
        upload = Dataset(dataset=json.loads(dataset), user=request.user, title=title, description=desc, public=public)
        upload.save()
        if preset > -1:
            PresetGeo.objects.filter(geo_id=preset).update(usage=F('usage')+1)
        return JsonResponse({'success': upload.set_id})
    except Exception as e:
        return JsonResponse({'error': e})

@csrf_exempt
@require_POST
def updateDataset(request):
    id_ = request.POST.get('id')
    title = request.POST.get('title')
    desc = None if request.POST.get('desc') == '' else request.POST.get('desc')
    dataset_ = request.POST.get('dataset')
    public = True if request.POST.get('public') == 'true' else False
    preset = int(request.POST.get('preset'))

    dataset = Dataset.objects.get(set_id=id_, user=request.user)
    dataset.title = title
    dataset.description = desc
    dataset.dataset = json.loads(dataset_)
    dataset.public = public
    try:
        #Dataset.objects.filter(set_id=id_,user=request.user).update(title=title, description=desc, dataset=json.loads(dataset), public=public)
        dataset.save()
        if preset > -1:
            PresetGeo.objects.filter(geo_id=preset).update(usage=F('usage')+1)
        return JsonResponse({'success': id_})
    except Exception as e:
        return JsonResponse({'error': e})

@csrf_exempt
@require_POST
def updatePublic(request):
    id_ = request.POST.get('id')
    public = True if request.POST.get('public') == 'Public' else False
    try:
        Dataset.objects.filter(set_id=id_,user=request.user).update(public=public)
        return JsonResponse({'success':id_})
    except Exception as e:
        return JsonResponse({'error':e})

@csrf_exempt
@require_POST
def updateViews(request):
    id_ = request.POST.get('id')
    Dataset.objects.filter(set_id=id_).update(views=F('views')+1)
    return JsonResponse({'message':id_+' views updated'})

@csrf_exempt
@require_POST
def updateSaves(request):
    id_ = request.POST.get('id')
    Dataset.objects.filter(set_id=id_).update(saves=F('saves')+1)
    return JsonResponse({'message':id_+'saves updated'})

@csrf_exempt
@require_POST
def addPreset(request):
    username = request.POST.get('username')
    name = request.POST.get('name')
    geodata = request.POST.get('geodata')
    user_id = User.objects.filter(username=username).values()[0]['id']
    try:
        upload = PresetGeo(name=name, geodata=json.loads(geodata), user=request.user)
        upload.save()
        return JsonResponse({'success': upload})
    except Exception as e:
        return JsonResponse({'error': e})

    return JsonResponse({})
    
@csrf_exempt
@require_POST
def getFile(request):
    file_ = request.FILES.get('file').read()
    accepted = ['application/json', 'application/geo+json','text/csv']
    content_type  = request.FILES.get('file').content_type
    
    if content_type in accepted:
        if content_type in ['application/json', 'application/geo+json']:
            data = json.load(BytesIO(file_))
            if 'type' in data and data['type'] == 'FeatureCollection':
                props = [feature['properties'] for feature in data.get('features', [])]
                return JsonResponse({'data': props, 'geo': data}, safe=False)

        elif content_type == 'text/csv':
            df = pd.read_csv(BytesIO(file_))
            data = json.loads(df.to_json(orient='records'))
            return JsonResponse({
                'data': data,
                'geo': None
            })
            
        return JsonResponse({'data': df.to_dict(orient='records'), 'geo': None}, safe=False)

def current_user(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "username": request.user.username,
            "email": request.user.email,
        })
    return JsonResponse({'loggedIn':'false '})

@csrf_exempt
@require_POST
def login_(request):
    user = request.POST.get('user')
    password = request.POST.get('password')
    return authenticate_(request,user,password)

def authenticate_(request,user_, password):
    user = authenticate(username=user_, password=password)
    if user:
        login(request,user)
        return JsonResponse({'success':'Logged in'})
    else:
        record = User.objects.filter(email=user_).values()
        if record:
            return authenticate_(request,record[0]['username'],password)
            
    return JsonResponse({'error':'Credentials do not match any accounts'})

@csrf_exempt
@require_POST
def logout_(request):
    logout(request)
    return JsonResponse({'message':'Logged out'})

@csrf_exempt
@require_POST
def delete_(request):
    #user.is_active = False
    #user.save()
    request.user.delete()
    logout(request)
    return JsonResponse({'status':'Account deleted'})

@csrf_exempt
@require_POST
def deleteDataset(request):
    id_ = request.POST.get('id')
    dataset = Dataset.objects.filter(set_id=id_,user=request.user).delete()
    return JsonResponse({'status':'Dataset deleted successfully'})

@csrf_exempt
@require_POST
def deletePreset(request):
    id_ = request.POST.get('id')
    preset = PresetGeo.objects.filter(geo_id=id_,user=request.user).delete()
    return JsonResponse({'status':'Preset deleted successfully'})

@csrf_exempt
@require_POST
def getUserSets(request):
    datasets = list(Dataset.objects.filter(user=request.user).values().order_by('title'))
    presets = list(PresetGeo.objects.filter(user=request.user).values().order_by('name'))
    return JsonResponse({'datasets':datasets, 'presets':presets})

@csrf_exempt
@require_POST
def register(request):
    username = request.POST.get('username')
    email = request.POST.get('email')
    password = request.POST.get('password')

    if User.objects.filter(username=username).values():
        return JsonResponse({'error':'Username already exists, please try another username'})

    if User.objects.filter(email=email).values():
        return JsonResponse({'error':'Email already exists, please try another email'})

    user = User.objects.create_user(username=username, email=email, password=password)
    login(request,user)
    return HttpResponse(JsonResponse({'success':'Account created'}))

@csrf_exempt
@require_POST
def checkDatasetAuth(request):
    if request.user.is_anonymous:
        return JsonResponse({'error':'Not authorised'})
    set_id = request.POST.get('set_id')
    dataset = Dataset.objects.filter(set_id=set_id).filter(user=request.user).values()
    if not dataset:
        return JsonResponse({'status':'Not authorised'})
    return JsonResponse({'status':'Authorised'})
