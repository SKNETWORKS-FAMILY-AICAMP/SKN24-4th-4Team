from django.db import models
from .user import TblUser


class TblUserChatHistory(models.Model):
    chat_id = models.AutoField(primary_key=True, db_column='CHAT_ID')
    user = models.ForeignKey(
        TblUser,
        on_delete=models.CASCADE,
        db_column='USER_ID',
        related_name='chat_histories'
    )
    chat_title = models.CharField(max_length=50, db_column='CHAT_TITLE')
    session_id = models.CharField(max_length=100, db_column='SESSION_ID')

    # 추가
    insurance_name = models.CharField(max_length=100, db_column='INSURANCE_NAME')

    reg_dt = models.DateTimeField(auto_now_add=True, db_column='REG_DT')

    class Meta:
        db_table = 'tbl_user_chat_history'
        managed = True


class TblUserChatHistDtl(models.Model):
    chat_dtl_id = models.AutoField(primary_key=True, db_column='CHAT_DTL_ID')
    chat = models.ForeignKey(
        TblUserChatHistory,
        on_delete=models.CASCADE,
        db_column='CHAT_ID',
        related_name='details'
    )
    bot_yn = models.CharField(max_length=1, db_column='BOT_YN')
    chat_content = models.CharField(max_length=1500, db_column='CHAT_CONTENT')

    # 추가
    chat_content_all = models.JSONField(null=True, blank=True, db_column='CHAT_CONTENT_ALL')

    reg_dt = models.DateTimeField(auto_now_add=True, db_column='REG_DT')

    class Meta:
        db_table = 'tbl_user_chat_hist_dtl'
        managed = True