from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class TblUser(models.Model):
    USER_ID = models.AutoField(primary_key=True, db_column='USER_ID')
    USER_NK = models.CharField(max_length=50, db_column='USER_NK')
    USER_EMAIL = models.CharField(max_length=100, unique=True, db_column='USER_EMAIL')
    USER_PW = models.CharField(max_length=100, db_column='USER_PW')
    PW_WRONG_CNT = models.IntegerField(default=0, db_column='PW_WRONG_CNT')
    IS_TEMP_PW = models.CharField(max_length=1, default='N', db_column='IS_TEMP_PW')
    UPDT_DT = models.DateTimeField(db_column='UPDT_DT')
    REG_DT = models.DateTimeField(auto_now_add=True, db_column='REG_DT')
    LAST_LOGIN_DT = models.DateTimeField(auto_now_add=True, db_column='LAST_LOGIN_DT')

    class Meta:
        db_table = 'TBL_USER'
        constraints = [
            models.CheckConstraint(
                condition=models.Q(IS_TEMP_PW__in=['Y', 'N']),
                name='CK_TBL_USER_IS_TEMP_PW',
            ),
        ]

    def __str__(self):
        return f"{self.USER_ID} - {self.USER_EMAIL}"


class TblFeedback(models.Model):
    FEEDBACK_ID = models.AutoField(primary_key=True, db_column='FEEDBACK_ID')
    USER_ID = models.ForeignKey(
        TblUser,
        on_delete=models.CASCADE,
        db_column='USER_ID',
        related_name='feedbacks',
    )
    SATISFACTION_LEVEL = models.IntegerField(
        db_column='SATISFACTION_LEVEL',
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    FEEDBACK_CONTENT = models.CharField(
        max_length=1000,
        null=True,
        blank=True,
        db_column='FEEDBACK_CONTENT',
    )
    REG_DT = models.DateTimeField(auto_now_add=True, db_column='REG_DT')

    class Meta:
        db_table = 'TBL_FEEDBACK'
        indexes = [
            models.Index(fields=['USER_ID'], name='IDX_TBL_FEEDBACK_USER_ID'),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(SATISFACTION_LEVEL__in=[1, 2, 3, 4, 5]),
                name='CK_TBL_FEEDBACK_SATISFACTION',
            ),
        ]

    def __str__(self):
        return f"Feedback {self.FEEDBACK_ID}"


class TblUserChatHistory(models.Model):
    CHAT_ID = models.AutoField(primary_key=True, db_column='CHAT_ID')
    USER_ID = models.ForeignKey(
        TblUser,
        on_delete=models.CASCADE,
        db_column='USER_ID',
        related_name='chat_histories',
    )
    CHAT_TITLE = models.CharField(max_length=50, db_column='CHAT_TITLE')
    SESSION_ID = models.CharField(max_length=100, db_column='SESSION_ID')
    REG_DT = models.DateTimeField(auto_now_add=True, db_column='REG_DT')

    class Meta:
        db_table = 'TBL_USER_CHAT_HISTORY'
        indexes = [
            models.Index(fields=['USER_ID'], name='IDX_CHAT_USER'),
        ]

    def __str__(self):
        return f"{self.CHAT_ID} - {self.CHAT_TITLE}"


class TblUserChatHistDtl(models.Model):
    CHAT_DTL_ID = models.AutoField(primary_key=True, db_column='CHAT_DTL_ID')
    CHAT_ID = models.ForeignKey(
        TblUserChatHistory,
        on_delete=models.CASCADE,
        db_column='CHAT_ID',
        related_name='chat_details',
    )
    BOT_YN = models.CharField(max_length=1, default='N', db_column='BOT_YN')
    CHAT_CONTENT = models.CharField(
        max_length=1000,
        null=True,
        blank=True,
        db_column='CHAT_CONTENT',
    )
    REG_DT = models.DateTimeField(auto_now_add=True, db_column='REG_DT')

    class Meta:
        db_table = 'TBL_USER_CHAT_HIST_DTL'
        indexes = [
            models.Index(fields=['CHAT_ID'], name='IDX_CHAT_DTL'),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(BOT_YN__in=['Y', 'N']),
                name='CK_TBL_CHAT_HIST_DTL_BOT_YN',
            ),
        ]

    def __str__(self):
        return f"ChatDetail {self.CHAT_DTL_ID}"


class TblFile(models.Model):
    FILE_ID = models.AutoField(primary_key=True, db_column='FILE_ID')
    FILE_NAME = models.CharField(max_length=100, db_column='FILE_NAME')
    FILE_EXT = models.CharField(max_length=10, default='pdf', db_column='FILE_EXT')
    FILE_PATH = models.CharField(max_length=300, db_column='FILE_PATH')
    INSURANCE_NAME = models.CharField(max_length=100, db_column='INSURANCE_NAME')

    class Meta:
        db_table = 'TBL_FILE'
        indexes = [
            models.Index(fields=['INSURANCE_NAME'], name='IDX_TBL_FILE_INSURANCE_NAME'),
        ]

    def __str__(self):
        return self.FILE_NAME


class TblVerifyCode(models.Model):
    VERIFY_CODE_ID = models.AutoField(primary_key=True, db_column='VERIFY_CODE_ID')
    USER_EMAIL = models.CharField(max_length=50, db_column='USER_EMAIL')
    VERIFY_CODE = models.CharField(max_length=50, db_column='VERIFY_CODE')
    REG_DT = models.DateTimeField(auto_now_add=True, db_column='REG_DT')
    REQ_IP = models.CharField(max_length=50, db_column='REQ_IP')

    class Meta:
        db_table = 'TBL_VERIFY_CODE'
        indexes = [
            models.Index(fields=['USER_EMAIL'], name='IDX_TBL_VERIFY_CODE_USER_EMAIL'),
        ]

    def __str__(self):
        return f"{self.USER_EMAIL} - {self.VERIFY_CODE}"