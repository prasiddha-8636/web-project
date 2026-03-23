from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, Task, Comment


class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class CommentSerializer(serializers.ModelSerializer):
    author = UserMinimalSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "author", "body", "created_at"]
        read_only_fields = ["id", "author", "created_at"]


class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserMinimalSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="assigned_to",
        allow_null=True,
        required=False,
        write_only=True,
    )
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            "id",
            "project",
            "title",
            "description",
            "priority",
            "status",
            "due_date",
            "assigned_to",
            "assigned_to_id",
            "comment_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_comment_count(self, obj):
        return obj.comments.count()


class TaskWriteSerializer(serializers.ModelSerializer):
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="assigned_to",
        allow_null=True,
        required=False,
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "priority",
            "status",
            "due_date",
            "assigned_to_id",
        ]
        read_only_fields = ["id"]


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserMinimalSerializer(read_only=True)
    task_count = serializers.SerializerMethodField()
    open_task_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "owner",
            "name",
            "description",
            "status",
            "task_count",
            "open_task_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]

    def get_task_count(self, obj):
        return obj.tasks.count()

    def get_open_task_count(self, obj):
        return obj.tasks.exclude(status="done").count()
