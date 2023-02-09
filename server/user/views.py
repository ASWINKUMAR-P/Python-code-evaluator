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
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import re
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def precision(TP, FP):
    return TP / (TP + FP)

def recall(TP, FN):
    return TP / (TP + FN)

def f1score(recall, precision):
    try:
        return 2 * (precision * recall) / (precision + recall)
    except:
        return 0

def sectostring(time):
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
    str_time = sh + ":" + sm + ":" + ss
    return str_time

def checkPlagiarism(code1,code2):
    code1 = re.sub(r'\s+', ' ', code1)
    code1 = re.sub(r'#.*', '', code1)
    code2 = re.sub(r'\s+', ' ', code2)
    code2 = re.sub(r'#.*', '', code2)
    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform([code1, code2])
    feature_vectors = X.toarray()
    similarity = cosine_similarity(feature_vectors[0].reshape(1, -1), feature_vectors[1].reshape(1, -1))
    similarity = similarity[0][0]
    print(similarity)
    if similarity > 0.8:
        return True
    else:
        return False

@permission_classes([AllowAny,])
@api_view(["POST"])
def login(request):
    data = request.data
    username = data["email"]
    password = data["password"]
    user = authenticate(username=username, password=password)
    if user is not None and user.is_staff:
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
                    "Token": str(Token.objects.get(user=user).key)
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
    starttime = datetime.now(pytz.UTC)
    student = Student.objects.get(sname=sname)
    test = Test.objects.get(tname=tname)
    student_test = Student_Test.objects.get(sname=student, tname=test)
    student_test.starttime = starttime
    student_test.save()
    student_test1 = Student_Test.objects.get(sname=student, tname=test)
    deadline = (student_test1.starttime.timestamp() + test.duration.total_seconds())*1000
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

@api_view(['GET'])
def getDeadline(request, pk):
    test = Test.objects.get(tname=pk)
    user = request.user
    student = Student.objects.get(user=user)
    student_test = Student_Test.objects.get(tname=test, sname=student)
    deadline = (student_test.starttime.timestamp() + student_test.tname.duration.total_seconds())*1000
    return Response({
        "deadline": deadline
    })

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
                    score.code = code
                    score.save()
            except:
                score = Student_Question.objects.create(sname=student, qname=question, student_score=points,
                                             tname=test, code=code, precision=0, recall=recall(tp, fn))
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
            score.code=code
            score.save()
    except:
        score = Student_Question.objects.create(sname=student,qname=question,student_score=points,tname=test,
                                     code=code,precision=precision(tp, fp), recall=recall(tp, fn))
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
    total_precision = 0
    total_recall = 0
    isPlagiarism = False
    score = Student_Question.objects.filter(sname=student, tname=test)
    for i in score:
        code = i.code
        qname = i.qname
        other = Student_Question.objects.filter(qname=qname, tname=tname).exclude(sname=student)
        for j in other:
            if checkPlagiarism(code, j.code):
                isPlagiarism = True
                i.isPlagiarised = True
                i.student_score = 0
                i.precision = 0
                i.recall = 0
                i.save()
                break
        total_score += i.student_score
        total_precision = i.precision
        total_recall = i.recall
    student_test.endtime = datetime.now(pytz.UTC)
    student_test.save()
    time = student_test.endtime - student_test.starttime
    result = Result.objects.create(sname=student, tname=test, score=total_score, time=time,
                                   total_precision=total_precision, total_recall=total_recall,isMalpractice=isPlagiarism)
    result.save()
    student_test.save()
    return Response({
        "status": "success",
        "name":student.sname
        })

@api_view(['GET'])
def result(request,pk):
    data = request.data
    tname = pk
    user = request.user
    test = Test.objects.get(tname=tname)
    student = Student.objects.get(user=user)
    student_test = Student_Test.objects.get(sname=student, tname=test)
    questions = test.question.all()
    try:
        result = Result.objects.get(tname=test, sname=student)
        time = result.time
        time = time.total_seconds()
        resulttime = sectostring(time)
    except Exception as e:
        print(e)
        resulttime = 0
    totaltime = test.duration.total_seconds()
    resulttotaltime = sectostring(totaltime)
    l=[]
    d={}
    d["time"] = resulttime
    d["ttime"] = resulttotaltime
    l.append(d)
    for i in questions:
        # print(i)
        d = {}
        id = i.id
        d["id"] = id
        try:
            score = Student_Question.objects.get(sname=student, qname=i, tname=test)
            d["score"] = str(score.student_score)+("/10")
            f1 = f1score(score.precision, score.recall)
            totalscore = ((score.student_score)/10 * 0.8) + (f1 * 0.2)
            d["tscore"] = str(round((totalscore*100),2))+("/100")
            if score.isPlagiarised is True:
                score.student_score=0
                score.precision=0
                score.recall=0
                score.save()
                d["tscore"] = "Malpracticed"
        except(Exception):
            print(Exception)
            d["score"] = "0/10"
            d["tscore"] = "0/100"
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
            token = Token.objects.create(user=user)
            token.save()
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

@api_view(['GET'])
@permission_classes([IsAuthenticated,IsAdminUser])
def validateadmin(request):
    return Response({
        "status":"success"
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

@api_view(["GET"])
def getTest(request):
    tests = Test.objects.all()
    testarray = []
    for i in tests:
        testarray.append({
            "test":i.tname
            })
    return Response(testarray)

@api_view(["GET"])
def generateReport(request,pk):
    test = Test.objects.get(tname=pk)
    result = Result.objects.filter(tname=test)
    total_tc = test.question.count()*10
    student = []
    testcase = []
    timetaken = []
    f1_score = []
    dataset = {}
    for i in result:
        student.append(i.sname.sname)
        testcase.append(i.score)
        timetaken.append(i.time.total_seconds())
        f1_score.append(f1score(i.total_recall,i.total_precision))
    
    dataset["student"] = student
    dataset["testcase"] = testcase
    dataset["timetaken"] = timetaken
    dataset["f1_score"] = f1_score

    df = pd.DataFrame(dataset)
    weights = {'testcase': 0.7, 'timetaken': 0.15, 'f1_score': 0.15}
    df['score'] = ((df['testcase']/total_tc) * weights['testcase']) + ((1-(df['timetaken']/test.duration.total_seconds())) * weights['timetaken']) + (df['f1_score'] * weights['f1_score'])
    df['score'] = df['score'].apply(lambda x: x*100)
    df['score'] = round(df['score'],3)
    x = df[['testcase', 'timetaken', 'f1_score']]
    y = df['score']
    clf = RandomForestRegressor()
    clf.fit(x,y)
    calculated_scores = clf.predict(x)
    df['calculated_score'] = calculated_scores
    df = df.sort_values(by='calculated_score', ascending=False)
    df['rank'] = df['calculated_score'].rank(ascending=False)
    df['timetaken'] = df['timetaken'].apply(sectostring)
    df['calculated_score'] = df['calculated_score'].apply(lambda x: round(x,3))
    df.loc[df['testcase'] == 0, 'score'] = 0
    json_objects = df.to_dict(orient='records')
    return Response(json_objects)