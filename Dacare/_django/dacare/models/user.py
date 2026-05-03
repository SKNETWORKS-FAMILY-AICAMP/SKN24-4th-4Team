from django.db import models
from pytz import timezone


class TblUser(models.Model):
    user_id = models.AutoField(primary_key=True, db_column='USER_ID')
    user_nk = models.CharField(max_length=50, db_column='USER_NK')
    user_email = models.CharField(max_length=100, unique=True, db_column='USER_EMAIL')
    user_pw = models.CharField(max_length=255, db_column='USER_PW')
    pw_wrong_cnt = models.IntegerField(default=0, db_column='PW_WRONG_CNT')
    is_temp_pw = models.CharField(max_length=1, default='N', db_column='IS_TEMP_PW')
    updt_dt = models.DateTimeField(null=True, blank=True, db_column='UPDT_DT')
    reg_dt = models.DateTimeField(auto_now_add=True, db_column='REG_DT')
    last_login_dt = models.DateTimeField(null=True, blank=True, db_column='LAST_LOGIN_DT')
    class Meta:
        db_table = 'tbl_user'
        managed = True

    def __str__(self):
        return self.user_email