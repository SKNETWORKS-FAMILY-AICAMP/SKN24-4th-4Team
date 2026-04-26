from django.db import models


class TblFile(models.Model):
    file_id = models.AutoField(primary_key=True, db_column='FILE_ID')
    file_name = models.CharField(max_length=100, db_column='FILE_NAME')
    file_ext = models.CharField(max_length=10, db_column='FILE_EXT')
    file_path = models.CharField(max_length=300, db_column='FILE_PATH')
    insurance_name = models.CharField(max_length=100, db_column='INSURANCE_NAME')

    class Meta:
        db_table = 'tbl_file'
        managed = True

    def __str__(self):
        return self.file_name