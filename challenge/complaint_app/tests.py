from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from rest_framework.response import Response
from typing import cast, Any
from complaint_app.models import Complaint, User, UserProfile
from complaint_app.serializers import ComplaintSerializer
from datetime import date

class ComplaintViewSetTests(APITestCase):
    def setUp(self):
        """Set up test data and client"""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            district='42'
        )
        self.client.force_authenticate(user=self.user)

        # Create test complaints
        self.complaint1 = Complaint.objects.create(
            complaint_type='Noise',
            descriptor='Loud Music',
            borough='MANHATTAN',
            zip='10001',
            account='NYCC42',
            opendate=date.today()
        )
        self.complaint2 = Complaint.objects.create(
            complaint_type='Noise',
            descriptor='Construction',
            borough='MANHATTAN',
            zip='10002',
            account='NYCC42',
            opendate=date.today()
        )

    def test_get_all_complaints(self):
        """Test retrieving all complaints"""
        url = reverse('complaint-list')
        response = cast(Response, self.client.get(url))
        complaints = Complaint.objects.all()
        serializer = ComplaintSerializer(complaints, many=True)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_get_open_cases(self):
        """Test retrieving open cases"""
        url = reverse('openCases-list')
        response = cast(Response, self.client.get(url))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        assert isinstance(response.data, list)
        self.assertEqual(len(response.data), 2)  # Both complaints are open by default

    def test_get_closed_cases(self):
        """Test retrieving closed cases"""
        # Close one complaint
        complaint = cast(Complaint, self.complaint1)
        complaint.closedate = date.today()
        complaint.save()
        
        url = reverse('closedCases-list')
        response = cast(Response, self.client.get(url))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        assert isinstance(response.data, list)
        self.assertEqual(len(response.data), 1)

    def test_get_top_complaints(self):
        """Test retrieving top complaints"""
        url = reverse('topComplaints-list')
        response = cast(Response, self.client.get(url))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        assert isinstance(response.data, list)
        self.assertEqual(len(response.data), 1)  # Only one complaint type
        self.assertEqual(response.data[0]['complaint_type'], 'Noise')
        self.assertEqual(response.data[0]['count'], 2)

    def test_unauthorized_access(self):
        """Test unauthorized access to endpoints"""
        client = cast(APIClient, self.client)
        client.force_authenticate(user=None)
        
        urls = [
            reverse('complaint-list'),
            reverse('openCases-list'),
            reverse('closedCases-list'),
            reverse('topComplaints-list'),
        ]
        
        for url in urls:
            response = cast(Response, self.client.get(url))
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_filter_by_district(self):
        """Test filtering complaints by district"""
        # Create a complaint in a different district
        Complaint.objects.create(
            complaint_type='Noise',
            descriptor='Party',
            borough='BROOKLYN',
            zip='11201',
            account='NYCC43',
            opendate=date.today()
        )
        
        url = reverse('complaint-list')
        response = cast(Response, self.client.get(url))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        assert isinstance(response.data, list)
        self.assertEqual(len(response.data), 2)  # Only complaints in MANHATTAN district
