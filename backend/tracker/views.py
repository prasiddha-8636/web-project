from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Project, Task, Comment
from .serializers import (
    ProjectSerializer,
    TaskSerializer,
    TaskWriteSerializer,
    CommentSerializer,
)


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, "owner"):
            return obj.owner == request.user
        if hasattr(obj, "project"):
            return obj.project.owner == request.user
        if hasattr(obj, "task"):
            return obj.task.project.owner == request.user
        return False


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user).prefetch_related("tasks")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["get", "post"], url_path="tasks")
    def tasks(self, request, pk=None):
        project = self.get_object()

        if request.method == "GET":
            tasks = project.tasks.select_related("assigned_to").prefetch_related("comments")
            serializer = TaskSerializer(tasks, many=True)
            return Response(serializer.data)

        serializer = TaskWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project)
            task = Task.objects.select_related("assigned_to").prefetch_related("comments").get(pk=serializer.instance.pk)
            return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_serializer_class(self):
        if self.request.method in ("POST", "PUT", "PATCH"):
            return TaskWriteSerializer
        return TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(
            project__owner=self.request.user
        ).select_related("assigned_to", "project").prefetch_related("comments")

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = TaskSerializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=["get", "post"], url_path="comments")
    def comments(self, request, pk=None):
        task = self.get_object()

        if request.method == "GET":
            serializer = CommentSerializer(task.comments.all(), many=True)
            return Response(serializer.data)

        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(task=task, author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommentSerializer

    def get_queryset(self):
        return Comment.objects.filter(task__project__owner=self.request.user)

    def destroy(self, request, pk=None):
        comment = get_object_or_404(Comment, pk=pk)
        if comment.author != request.user and comment.task.project.owner != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
