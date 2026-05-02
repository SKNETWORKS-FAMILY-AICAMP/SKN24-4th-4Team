from django.db import models
from .user import TblUser


class TblFeedback(models.Model):
    feedback_id = models.AutoField(primary_key=True, db_column='FEEDBACK_ID')
    user = models.ForeignKey(
        TblUser,
        on_delete=models.CASCADE,
        db_column='USER_ID',
        related_name='feedbacks'
    )
    satisfaction_level = models.IntegerField(db_column='SATISFACTION_LEVEL')
    feedback_content = models.CharField(
        max_length=1000,
        null=True,
        blank=True
    )
    reg_dt = models.DateTimeField(auto_now_add=True, db_column='REG_DT')

    class Meta:
        db_table = 'tbl_feedback'
        managed = True

    def __str__(self):
        return f'{self.user.user_email} - {self.satisfaction_level}'