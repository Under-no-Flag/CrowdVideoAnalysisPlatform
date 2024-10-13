from django.db import models

class Video(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='videos/')
    # 可以添加更多的字段，比如描述(description)，上传时间(upload_time)等

    def __str__(self):
        return self.title