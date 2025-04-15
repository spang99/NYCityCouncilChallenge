from django.contrib.auth.models import User
from .models import UserProfile, Complaint
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    user_id = serializers.IntegerField(source='user.id')

    class Meta:
        model = UserProfile
        fields = ('id', 'user_id', 'username', 'first_name', 'last_name', 
                 'full_name', 'district', 'party', 'borough')

class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ('unique_key', 'account', 'opendate', 'complaint_type', 
                 'descriptor', 'zip', 'borough', 'city', 'council_dist', 
                 'community_board', 'closedate')