from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import re

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        token['full_name'] = user.full_name
        token['grade'] = user.grade
        return token


class RegisterSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('email', 'username', 'full_name', 'major', 'role', 'password', 'password_confirmation')
        extra_kwargs = {
            'password': {'write_only': True, 'style': {'input_type': 'password'}},
            'full_name': {'required': True},
            'major': {'required': True},
            'role': {'required': True}, 
        }

    def create (self, validated_data):
        email = validated_data['email'].lower()
        username = email.split('@')[0]
        domain = email.split('@')[1]

        role = ""
        if domain == 'student.prasetiyamulya.ac.id':
            role = 'student'
        elif domain == 'prasetiyamulya.ac.id':
            role = 'instructor'

        user = User.objects.create_user(
            email=email,
            username=username,
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            major=validated_data['major'],
            role=role,
        )
        return user
    
    def validate(self, attrs):
        email = attrs.get('email', '').lower()
        role = attrs.get('role', '')

        if attrs['password'] != attrs.pop('password_confirmation'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        is_student_domain = 'student.prasetiyamulya.ac.id' in email
        is_instructor_domain = '@prasetiyamulya.ac.id' in email and not is_student_domain

        if is_student_domain and role != 'student':
            raise serializers.ValidationError({
                "role": "Email @student.prasetiyamulya.ac.id hanya bisa mendaftar sebagai 'Student'."
            })

        if is_instructor_domain and role != 'instructor':
            raise serializers.ValidationError({
                "role": "Email @prasetiyamulya.ac.id hanya bisa mendaftar sebagai 'Instructor'."
            })
        
        return attrs

    def validate_email(self, value):
        email = value.lower()

        student_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@student\.prasetiyamulya\.ac.id$')
        instructor_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@prasetiyamulya\.ac.id$')

        if student_pattern.match(email) or instructor_pattern.match(email):
            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError("Email is already registered.")
            return email
        
        raise serializers.ValidationError("Email must be a valid student or instructor email address.")
    
class StudentSerializer(serializers.ModelSerializer):
    major = serializers.CharField(source='get_major_display')

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'major', 'grade']
        read_only_fields = ['id', 'full_name', 'email', 'major']

    def validate_grade(self, value):
        if value is None or value == "":
            return value

        try:
            numeric_value = float(value)
        
        except (ValueError, TypeError):
            raise serializers.ValidationError("Nilai harus berupa angka.")

        if numeric_value > 100:
            raise serializers.ValidationError("Nilai tidak boleh lebih dari 100.")
        if numeric_value < 0:
            raise serializers.ValidationError("Nilai tidak boleh kurang dari 0.")
        
        return value