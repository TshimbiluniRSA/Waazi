from django.urls import path
from . import views

urlpatterns = [
    path('submit/', views.AssessmentSubmitView.as_view()),
    path('', views.AssessmentListView.as_view()),
    path('<uuid:pk>/', views.AssessmentDetailView.as_view()),
]
