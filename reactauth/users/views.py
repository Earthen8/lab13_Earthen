from rest_framework import generics, permissions, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, StudentSerializer
from .models import CustomUser
from .permissions import IsInstructor
from rest_framework.permissions import IsAuthenticated

class MajorListView(APIView):
    def get(self, request, format=None):
        major_choices = CustomUser.MAJOR_CHOICES
        majors_json = [{"value": key, "label": label} for key, label in major_choices]
        return Response(majors_json, status=status.HTTP_200_OK)

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer
  
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated, IsInstructor]

    def get_queryset(self):
        return CustomUser.objects.filter(role='student')