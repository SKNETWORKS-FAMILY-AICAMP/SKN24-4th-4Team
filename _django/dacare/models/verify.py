from django.db import models


class TblVerifyCode(models.Model):
    verify_code_id = models.AutoField(primary_key=True, db_column='VERIFY_CODE_ID')
    user_email = models.CharField(max_length=50, db_column='USER_EMAIL')
    verify_code = models.CharField(max_length=50, db_column='VERIFY_CODE')
    reg_dt = models.DateTimeField(auto_now_add=True, db_column='REG_DT')
    req_ip = models.CharField(max_length=50, db_column='REQ_IP')

    class Meta:
        db_table = 'tbl_verify_code'
        managed = True

    def __str__(self):
        return f'{self.user_email} - {self.verify_code}'