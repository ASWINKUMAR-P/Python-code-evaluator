from django.db import models
from django.contrib.auth.models import User

class Student(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    sname = models.CharField(max_length=255)
    college = models.CharField(max_length=255)
    year = models.SmallIntegerField()
    department = models.CharField(max_length=255)
    registernumber = models.CharField(max_length=255) 
    def __str__(self):
        return self.sname

class Question(models.Model):
    
    qname = models.CharField(max_length=50)
    desc = models.TextField()
    level = models.CharField(max_length=10)
    points = models.SmallIntegerField()
    const1 = models.TextField()
    const2 = models.TextField()
    testcaseinput1 = models.TextField()
    testcaseoutput1 = models.TextField()
    testcaseinput2 = models.TextField()
    testcaseoutput2 = models.TextField()
    testcaseinput3 = models.TextField()
    testcaseoutput3 = models.TextField()
    testcaseinput4 = models.TextField()
    testcaseoutput4 = models.TextField()
    testcaseinput5 = models.TextField()
    testcaseoutput5 = models.TextField()
    testcaseinput6 = models.TextField()
    testcaseoutput6 = models.TextField()
    testcaseinput7 = models.TextField()
    testcaseoutput7 = models.TextField()
    testcaseinput8 = models.TextField()
    testcaseoutput8 = models.TextField()
    testcaseinput9 = models.TextField()
    testcaseoutput9 = models.TextField()
    testcaseinput10 = models.TextField()
    testcaseoutput10 = models.TextField()
    testcaseinput11 = models.TextField()
    testcaseoutput11 = models.TextField()
    testcaseinput12 = models.TextField()
    testcaseoutput12 = models.TextField()
    testcaseinput13 = models.TextField()
    testcaseoutput13 = models.TextField()

    def __str__(self):
        return self.qname

class Test(models.Model):
    tname = models.CharField(max_length=20, primary_key=True)
    duration = models.DurationField(default=None)
    student = models.ManyToManyField(Student)
    starttime = models.DateTimeField(default=None)
    endtime = models.DateTimeField(default=None)
    question = models.ManyToManyField(Question)

    def __str__(self):
        return self.tname

class Student_Test(models.Model):
    tname = models.ForeignKey(Test, on_delete=models.CASCADE)
    sname = models.ForeignKey(Student, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    starttime = models.DateTimeField(default=None, null=True, blank=True)
    endtime = models.DateTimeField(default=None, null=True, blank=True)
    password = models.CharField(max_length=10, default=None, null=True, blank=True)

class Student_Question(models.Model):
    qname = models.ForeignKey(Question, on_delete=models.CASCADE)
    sname = models.ForeignKey(Student, on_delete=models.CASCADE)
    student_score = models.IntegerField()
    tname = models.ForeignKey(Test, on_delete=models.CASCADE)
    precision = models.FloatField()
    recall = models.FloatField()
    code = models.TextField(default=None, null=True, blank=True)
    isPlagiarised = models.BooleanField(default=False)

class Result(models.Model):
    tname = models.ForeignKey(Test, on_delete=models.CASCADE)
    sname = models.ForeignKey(Student, on_delete=models.CASCADE)
    score = models.FloatField()
    time = models.DurationField()
    total_precision = models.FloatField(default=None)
    total_recall = models.FloatField(default=None)
    isMalpractice = models.BooleanField(default=False)