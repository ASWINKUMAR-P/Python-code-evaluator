from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from datetime import datetime
from django.contrib.auth import authenticate
from .serializer import *
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
import string, random, sys
from pytz import timezone
import pytz
from datetime import timedelta

def precision(TP, FP):
    return TP / (TP + FP)
def recall(TP, FN):
    return TP / (TP + FN)
def f1score(recall, precision):
    return 2 * (precision * recall) / (precision + recall)
@permission_classes([AllowAny,])
@api_view(["POST"])
def login(request):
    data = request.data
    username = data["email"]
    password = data["password"]
    user = authenticate(username=username, password=password)
    if user is not None:
        d = {
            "role": "admin",
            "Token": str(Token.objects.get(user=user).key)
        }
        l=[]
        l.append(d)
        return Response(l)
    else:
        try:
            user = User.objects.get(email=username)
            student = Student.objects.get(user=user)
            student_test = Student_Test.objects.get(sname=student, password=password)
            test = Test.objects.get(tname=student_test.tname.tname)
            if test.starttime < timezone('UTC').localize(datetime.now()) < test.endtime:
                d = {
                    "name": student.sname,
                    "email": student.user.email,
                    "role": "student",
                    "status": student_test.completed,
                    "test": test.tname,
                    "Token": str(Token.objects.get(user=user) .key)
                }
                l=[]
                l.append(d)
                return Response(l)
            else:
                raise Exception
        except Exception as e:
            d = {
                "status": "failed"
            }
            print(e)
            l=[]
            l.append(d)
            return Response(l)

@permission_classes([IsAuthenticated,])
@api_view(['POST'])
def starttest(request):
    data = request.data
    sname = data["name"]
    tname = data["test"]
    starttime = data["time"]
    student = Student.objects.get(sname=sname)
    test = Test.objects.get(tname=tname)
    student_test = Student_Test.objects.get(sname=student, tname=test)
    if student_test.starttime is None:
        student_test.starttime = starttime
        deadline = ((starttime) + test.duration)*1000

        student_test.save()
    return Response({
        "status": "success",
        "deadline" : deadline
        })

@permission_classes([IsAuthenticated,])
@api_view(['GET'])
def getQuestions(request, pk):
    test = Test.objects.get(tname=pk)
    questions = test.question.all()
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)

@permission_classes([IsAuthenticated,])
@api_view(['GET'])
def getQuestion(request, pk1,pk2):
    test = Test.objects.get(tname=pk1)
    question = test.question.get(id=pk2)
    serializer = QuestionSerializer(question)
    x = []
    x.append(serializer.data)
    return Response(x)

@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def setTimer(request):
    user = request.user
    student = Student.objects.get(user=user)
    test = Test.objects.get(tname=request.data["test"])
    student_test = Student_Test.objects.get(sname=student, tname=test)
    deadline =( student_test.starttime.timestamp() + test.duration )
    time = datetime.now().timestamp()
    difftime = deadline - time
    hrs,r=divmod(difftime,3600)
    mins,r=divmod(r,60)
    secs=r
    return Response({
        "hour":hrs,
        "minute":mins,
        "second":secs
    })

@api_view(['POST'])
def execCode(request):
    tp, tn, fp, fn = 0, 0, 0, 0
    qid = request.data["id"]
    code = request.data["code"]
    sname = request.data["name"]
    tname = request.data["test"]
    question = Question.objects.get(id=qid)
    test = Test.objects.get(tname=tname)
    student = Student.objects.get(sname=sname)
    tc = []
    points = 0
    tc.append([question.testcaseinput1, question.testcaseoutput1, "public"])
    tc.append([question.testcaseinput2, question.testcaseoutput2, "public"])
    tc.append([question.testcaseinput3, question.testcaseoutput3, "public"])
    tc.append([question.testcaseinput4, question.testcaseoutput4, "private"])
    tc.append([question.testcaseinput5, question.testcaseoutput5, "private"])
    tc.append([question.testcaseinput6, question.testcaseoutput6, "private"])
    tc.append([question.testcaseinput7, question.testcaseoutput7, "private"])
    tc.append([question.testcaseinput8, question.testcaseoutput8, "private"])
    tc.append([question.testcaseinput9, question.testcaseoutput9, "private"])
    tc.append([question.testcaseinput10, question.testcaseoutput10, "private"])
    tc.append([question.testcaseinput11, question.testcaseoutput11, "special"])
    tc.append([question.testcaseinput12, question.testcaseoutput12, "private"])
    tc.append([question.testcaseinput13, question.testcaseoutput13, "special"])

    useroutput = []
    tcoutput = []
    usereditedoutput = []
    tceditedoutput = []
    for i in tc:
        ip = i[0]
        op = i[1]
        tcoutput.append(i[1])
        try:
            original_stdout = sys.stdout
            sys.stdout = open("file.txt", "w")
            inputdata = ip.split("\n")

            def input():
                a = inputdata[0]
                inputdata.pop(0)
                return a

            exec(code)
            sys.stdout.close()
            sys.stdout = original_stdout
            output = open("file.txt", "r").read()
            useroutput.append(output)
            output = (output.strip()).split("\n")
            op = (op.strip()).split("\n")
            for i in range(len(output)):
                output[i] = output[i].strip()
            for i in range(len(op)):
                op[i] = op[i].strip()
            usereditedoutput.append(output)
            tceditedoutput.append(op)
        except Exception as e:
            usereditedoutput.append(str(e))
            useroutput.append(str(e))
            op = (op.strip()).split("\n")
            for i in range(len(op)):
                op[i] = op[i].strip()
            tceditedoutput.append(op)
    points = 0
    for i in range(2):
        if tceditedoutput[i] != usereditedoutput[i]:
            fn += 1
            try:
                score = Student_Question.objects.get(sname=student, qname=question, tname=test)
                if score.student_score < points:
                    score.student_score = points
                    score.precision=0
                    score.recall=recall(tp,fn)
                    score.save()
            except:
                score = Student_Question.objects.create(sname=student, qname=question, student_score=points,
                                             tname=test, precision=0, recall=recall(tp, fn))
                score.save()
            d = {}
            d["status"] = "public"
            d["input"] = tc[i][0]
            d["expectedoutput"] = tcoutput[i]
            d["useroutput"] = useroutput[i]
            l = []
            l.append(d)
            return Response(l)
        else:
            points += 1
            tp += 1

    points = 3
    tp = 3

    for i in range(3, 10):
        if tceditedoutput[i] == usereditedoutput[i]:
            points += 1
            tp += 1
        else:
            fn += 1

    for i in range(10, 13):
        if tceditedoutput[i] == usereditedoutput[i]:
            fp += 1
        else:
            fn += 1

    try:
        score = Student_Question.objects.get(sname=student, qname=question, tname=test)
        if score.student_score < points:
            score.student_score = points
            score.precision=precision(tp,fp)
            score.recall=recall(tp,fn)
            score.save()
    except:
        score = Student_Question.objects.create(sname=student,qname=question,student_score=points,tname=test,
                                     precision=precision(tp, fp), recall=recall(tp, fn))
        score.save()
    if points == 10:
        d = {}
        d["op1"] = "Code"
        d["op2"] = "Executed"
        d["op3"] = "Successfully"
        d["status"] = "passed"
        l = []
        l.append(d)
        return Response(l)
    else:
        d = {}
        d["status"] = "private"
        d["score"] = points
        l = []
        l.append(d)
        return Response(l)

@permission_classes([IsAuthenticated],)
@api_view(['GET'])
def submit(request,pk):
    data = request.data
    token = request.auth
    user = request.user
    student = Student.objects.get(user=user)
    tname = pk
    test = Test.objects.get(tname=tname)
    student_test = Student_Test.objects.get(sname=student, tname=test)
    student_test.completed = True
    student_test.save()
    total_score = 0
    score = Student_Question.objects.filter(sname=student, tname=test)
    for i in score:
        total_score += i.student_score
        total_precision = i.precision
        total_recall = i.recall
    student_test.endtime = datetime.now(pytz.UTC)
    time = student_test.endtime - student_test.starttime
    result = Result.objects.create(sname=student, tname=test, score=total_score, time=time,
                                   total_precision=total_precision, total_recall=total_recall)
    result.save()
    student_test.save()
    return Response({
        "status": "success",
        "name":student.sname
        })

@api_view(['POST'])
def result(request):
    data = request.data
    tname = data["test"]
    sname = data["name"]
    test = Test.objects.get(tname=tname)
    student = Student.objects.get(sname=sname)
    student_test = Student_Test.objects.get(sname=student, tname=test)
    questions = test.question.all()
    result = Result.objects.get(tname=test, sname=student)
    totaltime = test.duration.total_seconds()
    h,r = divmod(totaltime,3600)
    m,s = divmod(r,60)
    h=int(h)
    m=int(m)
    s=int(s) 
    if h < 10:
        sh = "0" + str(h)
    else:
        sh = str(h)
    if m < 10:
        sm = "0" + str(m)
    else:
        sm = str(m)
    if s < 10:
        ss = "0" + str(s)
    else:
        ss = str(s)
    resulttotaltime = sh + ":" + sm + ":" + ss
    l = []
    d = {}
    time = result.time
    time = time.total_seconds()
    h, r = divmod(time, 3600)
    m, s = divmod(r, 60)
    h = int(h)
    m = int(m)
    s = int(s)
    if h < 10:
        sh = "0" + str(h)
    else:
        sh = str(h)
    if m < 10:
        sm = "0" + str(m)
    else:
        sm = str(m)
    if s < 10:
        ss = "0" + str(s)
    else:
        ss = str(s)
    resulttime = sh + ":" + sm + ":" + ss
    d["time"] = resulttime
    d["ttime"] = resulttotaltime
    # d["time"]=result.time
    l.append(d)
    for i in questions:
        # print(i)
        d = {}
        id = i.id
        d["id"] = id
        try:
            score = Student_Question.objects.get(sname=student, qname=i)
            d["score"] = str(score.student_score)+("/10")
            d["tscore"] = str((f1score(score.precision, score.recall)*100))+("/100")
        except:
            d["score"] = 0
            d["tscore"] = 0
        l.append(d)
    return Response(l)

####################################################################################################################
@api_view(["GET"])
def sendStudent(request):
    students = Student.objects.all()
    studentarray = []
    for i in students:
        user = i.user
        studentarray.append({
            "name" : i.sname,
            "year" : i.year,
            "college" : i.college,
            "email" : user.email,
            "registernumber" : i.registernumber,
            "department" : i.department,
            })
    return Response(studentarray)

@api_view(["POST"])
def createStudent(request):
    studentDetail = request.data["StudentjsonData"]
    for i in studentDetail:
        print(i)
        sname = i["Name"]
        year = i["Year"]
        college = i["College"]
        email = i["Email"]
        registernumber = i["Registernumber"]
        department = i["Department"]
        try:
            user = User.objects.create_user(username=email, email=email, password=None)
            user.save()
            student = Student(sname=sname, year=year, college=college,department=department, user=User.objects.get(email=email),registernumber=registernumber)
            student.save()
        except Exception as e:
            return Response({"status": str(e)})
    return Response({"status": "success"})

@api_view(["POST"])
def createQuestion(request):
    questionDetail = request.data["QuestionjsonData"]
    for i in questionDetail:
        qname = i["qname"]
        desc = i["desc"]
        level = i["level"]
        points = i["points"]
        const1 = i["const1"]
        const2 = i["const2"]
        testcaseinput1 = i["testcaseinput1"]
        testcaseoutput1 = i["testcaseoutput1"]
        testcaseinput2 = i["testcaseinput2"]
        testcaseoutput2 = i["testcaseoutput2"]
        testcaseinput3 = i["testcaseinput3"]
        testcaseoutput3 = i["testcaseoutput3"]
        testcaseinput4 = i["testcaseinput4"]
        testcaseoutput4 = i["testcaseoutput4"]
        testcaseinput5 = i["testcaseinput5"]
        testcaseoutput5 = i["testcaseoutput5"]
        testcaseinput6 = i["testcaseinput6"]
        testcaseoutput6 = i["testcaseoutput6"]
        testcaseinput7 = i["testcaseinput7"]
        testcaseoutput7 = i["testcaseoutput7"]
        testcaseinput8 = i["testcaseinput8"]
        testcaseoutput8 = i["testcaseoutput8"]
        testcaseinput9 = i["testcaseinput9"]
        testcaseoutput9 = i["testcaseoutput9"]
        testcaseinput10 = i["testcaseinput10"]
        testcaseoutput10 = i["testcaseoutput10"]
        testcaseinput11 = i["testcaseinput11"]
        testcaseoutput11 = i["testcaseoutput11"]
        testcaseinput12 = i["testcaseinput12"]
        testcaseoutput12 = i["testcaseoutput12"]
        testcaseinput13 = i["testcaseinput13"]
        testcaseoutput13 = i["testcaseoutput13"]
        try:
            question = Question(
                qname=qname,
                desc=desc,
                level=level,
                points=points,
                const1=const1,
                const2=const2,
                testcaseinput1=testcaseinput1,
                testcaseoutput1=testcaseoutput1,
                testcaseinput2=testcaseinput2,
                testcaseoutput2=testcaseoutput2,
                testcaseinput3=testcaseinput3,
                testcaseoutput3=testcaseoutput3,
                testcaseinput4=testcaseinput4,
                testcaseoutput4=testcaseoutput4,
                testcaseinput5=testcaseinput5,
                testcaseoutput5=testcaseoutput5,
                testcaseinput6=testcaseinput6,
                testcaseoutput6=testcaseoutput6,
                testcaseinput7=testcaseinput7,
                testcaseoutput7=testcaseoutput7,
                testcaseinput8=testcaseinput8,
                testcaseoutput8=testcaseoutput8,
                testcaseinput9=testcaseinput9,
                testcaseoutput9=testcaseoutput9,
                testcaseinput10=testcaseinput10,
                testcaseoutput10=testcaseoutput10,
                testcaseinput11=testcaseinput11,
                testcaseoutput11=testcaseoutput11,
                testcaseinput12=testcaseinput12,
                testcaseoutput12=testcaseoutput12,
                testcaseinput13=testcaseinput13,
                testcaseoutput13=testcaseoutput13
            )
            question.save()
        except Exception as e:
            return Response({"status": str(e)})
    return Response({"status": "success"})

@api_view(["GET"])
def getLeaderBoard(request, pk):
    tname = pk
    test = Test.objects.get(tname=tname)
    result = Result.objects.filter(tname=test)
    result = result.order_by("score")
    result = result.order_by("time")
    rank = 1
    l = []
    for i in result:
        d = {}
        d["rank"] = rank
        d["name"] = i.sname.sname

        time = i.time.total_seconds()
        h, r = divmod(time, 3600)
        m, s = divmod(r, 60)
        h = int(h)
        m = int(m)
        s = int(s)
        if h < 10:
            sh = "0" + str(h)
        else:
            sh = str(h)
        if m < 10:
            sm = "0" + str(m)
        else:
            sm = str(m)
        if s < 10:
            ss = "0" + str(s)
        else:
            ss = str(s)
        resulttime = sh + ":" + sm + ":" + ss
        d["time"] = resulttime
        l.append(d)
        rank += 1
    return Response(l)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def validate(request):
    token = request.headers["Authorization"]
    user = request.user
    student = Student.objects.get(user=user)
    return Response({
        "name":student.sname
    })

@api_view(["POST"])
def createTest(request):
    tname = request.data["testName"]
    starttime = request.data["startTime"]
    endtime = request.data["endTime"]
    duration = request.data["duration"]
    duration = duration.split(":")
    duration = timedelta(hours=int(duration[0]), minutes=int(duration[1]))
    test = Test.objects.create(tname=tname, starttime=starttime, endtime=endtime, duration=duration)
    mail_array = request.data["selectedstudents"]
    for i in mail_array:
        user = User.objects.get(email=i["email"])
        characters = string.ascii_letters + string.digits + "@#$%&^*!"
        password = ''.join(random.choice(characters) for i in range(8))
        send_mail(
            'Test credentials',
            'Your credentials for the test ' + tname + '\nEmail=' + i["email"] + '\nPassword=' + password,
            'pythonevaluvator@gmail.com',
            [i["email"]],
            fail_silently=False,
        )
        user.set_password(password)
        user.save()
        student = Student.objects.get(user=user)
        test.student.add(student)
        student_test = Student_Test.objects.create(sname=student, tname=test, password=password)
        student_test.save()
    question_array = request.data["selectedquestions"]
    for i in question_array:
        question = Question.objects.get(id=i["id"])
        test.question.add(question)
    test.save()
    return Response({"Status": "Success"})

@api_view(["GET"])
def sendQuestion(request):
    questions = Question.objects.all()
    questionarray = []
    for i in questions:
        questionarray.append(QuestionSerializer(i).data)
    return Response(questionarray)