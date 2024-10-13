from django.http import JsonResponse
from .models import Video
from django.views import View

class GetStoreVideosView(View):
    def get(self, request):
        videos = Video.objects.all().values('id', 'title', 'file')
        # video_list = list(videos)
        video_list=['1.mp4','2.mp4']
        return JsonResponse(video_list, safe=False)