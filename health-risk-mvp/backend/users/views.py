from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
import uuid

from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {'access': str(refresh.access_token), 'refresh': str(refresh)}


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'user': UserSerializer(user).data,
            **get_tokens(user),
        }, status=status.HTTP_201_CREATED)


class GuestLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        guest_id = uuid.uuid4().hex[:8]
        user = User.objects.create_user(
            email=f"guest_{guest_id}@healthrisk.guest",
            name=f"Guest {guest_id.upper()}",
            password=uuid.uuid4().hex,
            is_guest=True,
        )
        return Response({
            'user': UserSerializer(user).data,
            **get_tokens(user),
        }, status=status.HTTP_201_CREATED)


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
