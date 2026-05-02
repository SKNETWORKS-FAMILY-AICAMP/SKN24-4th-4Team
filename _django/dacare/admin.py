from django.contrib import admin

from dacare.models import TblUser, TblVerifyCode, TblUserChatHistory, TblUserChatHistDtl, TblFeedback, TblFile
admin.site.register(TblUser)
admin.site.register(TblVerifyCode)
admin.site.register(TblUserChatHistory)
admin.site.register(TblUserChatHistDtl)
admin.site.register(TblFeedback)
admin.site.register(TblFile)