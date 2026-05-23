from django.urls import path, include

from organizations.views import InviteUserView, AcceptInviteView, InviteByEmail, ApiListView, ApiCreateView, \
    ApiDeleteView

urlpatterns = [
    path("invite/", InviteUserView.as_view()),
    path("invite-link/", InviteByEmail.as_view()),
    path("accept/<str:token>", AcceptInviteView.as_view()),

    #     API
    path("api-list/", ApiListView.as_view()),
    path("api-create/", ApiCreateView.as_view()),
    path("api-delete/<str:pk>", ApiDeleteView.as_view()),
]
