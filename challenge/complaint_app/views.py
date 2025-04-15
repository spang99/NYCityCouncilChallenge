from rest_framework import viewsets
from rest_framework.response import Response
from .models import Complaint, UserProfile
from .serializers import ComplaintSerializer, UserProfileSerializer
from django.db.models import Count
from django.db.models import Q

class ComplaintViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer

    def get_queryset(self):
        user_profile = UserProfile.objects.get(user=self.request.user)
        district = user_profile.district
        
        if len(district) == 1:
            district = f"0{district}"
        
        formatted_district = f"NYCC{district}"
        return Complaint.objects.filter(council_dist=formatted_district)

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class OpenCasesViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer

    def get_queryset(self):
        user_profile = UserProfile.objects.get(user=self.request.user)
        district = user_profile.district
        
        if len(district) == 1:
            district = f"0{district}"
        
        formatted_district = f"NYCC{district}"
        return Complaint.objects.filter(
            account=formatted_district,
            opendate__isnull=False,
            closedate__isnull=True
        )

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ClosedCasesViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer

    def get_queryset(self):
        user_profile = UserProfile.objects.get(user=self.request.user)
        district = user_profile.district
        
        if len(district) == 1:
            district = f"0{district}"
        
        formatted_district = f"NYCC{district}"
        return Complaint.objects.filter(
            account=formatted_district,
            opendate__isnull=False,
            closedate__isnull=False
        )

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class TopComplaintTypeViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer

    def get_queryset(self):
        user_profile = UserProfile.objects.get(user=self.request.user)
        district = user_profile.district
        
        if len(district) == 1:
            district = f"0{district}"
        
        formatted_district = f"NYCC{district}"
        complaints = Complaint.objects.filter(account=formatted_district)
        
        top_counts = complaints.values('complaint_type').annotate(
            count=Count('complaint_type')
        ).order_by('-count')[:3].values_list('count', flat=True)
        
        top_complaints = complaints.values('complaint_type').annotate(
            count=Count('complaint_type')
        ).filter(count__in=top_counts).order_by('-count', 'complaint_type')
        
        result = []
        current_count = None
        current_types = []
        
        for complaint in top_complaints:
            if current_count is None:
                current_count = complaint['count']
                current_types = [complaint['complaint_type']]
            elif complaint['count'] == current_count:
                current_types.append(complaint['complaint_type'])
            else:
                result.append({
                    'complaint_type': ', '.join(current_types),
                    'count': current_count
                })
                current_count = complaint['count']
                current_types = [complaint['complaint_type']]
        
        if current_types:
            result.append({
                'complaint_type': ', '.join(current_types),
                'count': current_count
            })
        
        return result[:3]

    def list(self, request):
        queryset = self.get_queryset()
        return Response(queryset)

class ConstituentComplaintsViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer

    def get_queryset(self):
        user_profile = UserProfile.objects.get(user=self.request.user)
        district = user_profile.district
        
        if len(district) == 1:
            district = f"0{district}"
        
        formatted_district = f"NYCC{district}"
        return Complaint.objects.filter(account=formatted_district)

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class UserProfileViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset.first())
        return Response(serializer.data)