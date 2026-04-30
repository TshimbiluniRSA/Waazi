from django.urls import path
from .views import DownloadReportView

urlpatterns = [
    path('<uuid:assessment_id>/pdf/', DownloadReportView.as_view()),
]
