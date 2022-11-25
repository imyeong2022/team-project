from flask import Flask, redirect, url_for, render_template, request, flash, flash, jsonify, make_response
from flask import request, session
from flask_mail import Mail, Message
import pymysql
import hashlib
import re
import json
import datetime
app = Flask(__name__)
# 2022 11 10 병합작업 1차버전입니다.
########### 데이터베이스 접속 전역변수 선언############


def dbcall():
    con = pymysql.connect(host='localhost',
                      user='root',
                      password='java',
                      db='final_test',
                      charset='utf8mb4',
                      cursorclass=pymysql.cursors.DictCursor)
    return con

########### 데이터베이스 접속 전역변수 선언############
def mailcall():

    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USERNAME'] = 'kongjh941109@gmail.com'
    app.config['MAIL_PASSWORD'] = 'snuejrgmmznyneie'
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = True
    mail = Mail(app)
    return mail

# 쿠키테스트


@app.route('/setcookie', methods=['POST', 'GET'])
def setcookie():
    if request.method == 'POST':
        user = request.form['coocke']
        print("쿠키테스트", user)
        resp = make_response("Cookie Setting Complete")
        resp.set_cookie('userID', user)
    return resp


@app.route('/getcookie')
def getcookie():
    name = request.cookies.get('userID')
    return name


@app.route('/accountfind')
def accountfind():
    con = dbcall()
    cursor = con.cursor()
    sql = "SELECT ID,email,phone from member"
    cursor.execute(sql)
    userlist2 = cursor.fetchall()
    print(type(userlist2))
    print(userlist2)
    cursor.close()
    return render_template('Board/account.html')


@app.route('/accountfind_proc', methods=['POST'])
def accountfind_proc():
    mail = mailcall()
    con = dbcall()
    cursor = con.cursor()
    user_name_recive = request.form['user_name_give']
    user_email_recive = request.form['user_email_give']
    user_phone_recive = request.form['user_phone_give']
    sql = "SELECT ID from member where name = %s and email = %s and phone=%s"
    cursor.execute(
        sql, (user_name_recive, user_email_recive, user_phone_recive))
    find_userid = cursor.fetchone()
    find_userid = find_userid['ID']
    print(find_userid)
    msg = Message('[잡아라]' + user_name_recive+'님의 아이디를 안내드립니다.',
                  sender='kongjh941109@gmail.com', recipients=[user_email_recive])
    msg.body = '회원님 안녕하세요.\n''회원님의 아이디는 다음과 같습니다.\n' '[' + \
        find_userid + ']\n 앞으로도 더욱 편리한 서비스를 제공하기 위해 최선을 다하겠습니다.'
    mail.send(msg)
    cursor.close()
    return jsonify({'msg': '회원님의 이메일로 아이디를 전송했습니다.'})


@app.route('/passwordfind')
def passwordfind():
    con = dbcall()
    cursor = con.cursor()
    sql = "SELECT ID,email,phone from member"
    cursor.execute(sql)
    userlist2 = cursor.fetchall()
    print(type(userlist2))
    print(userlist2)
    cursor.close()
    return render_template('Board/accountpassword.html')


@app.route('/passwordfind_proc', methods=['POST'])
def passwordfind_proc():
    mail = mailcall()
    con = dbcall()
    cursor = con.cursor()
    user_name_recive = request.form['user_name_give']
    user_id_recive = request.form['user_id_give']
    user_phone_recive = request.form['user_phone_give']
    code = request.form['code']
    # sql = "UPDATE member SET member.PW = %s where email in(SELECT email from (select email from member where name = %s and id = %s and phone=%s)as TMP)"
    # 서브쿼리로 처리해보려고했으나 email값을 변수로 사용을 못함... 다중sql문 쓰는게 맞을듯함
    sql = "SELECT email from member where name = %s and id = %s and phone=%s"
    cursor.execute(
        sql, (user_name_recive, user_id_recive, user_phone_recive, ))
    find_useremail = cursor.fetchone()
    sendmail = find_useremail['email']
    re_pw_hash = hashlib.sha256(code.encode('utf-8')).hexdigest()
    sql2 = "update member set pw = %s where email = %s"
    cursor.execute(sql2, (re_pw_hash, sendmail, ))
    con.commit()
    cursor.close()
    msg = Message('[잡아라]에 요청하신 임시비밀번호입니다.',
                  sender='kongjh941109@gmail.com', recipients=[sendmail])
    msg.body = user_name_recive + \
        '님 안녕하세요.\n 임시 비밀번호를 발급하오니 잡아라 홈페이지에 오셔서 로그인 하신 후.' + \
        ' \n 마이페이지>>개인정보변경에서 반드시 비밀번호를 변경하여 주시기 바랍니다. ' + \
        ' \n 임시비밀번호  :  ' + code + \
        ' \n 앞으로도 더욱 편리한 서비스를 제공하기 위해 최선을 다하겠습니다.'
    mail.send(msg)

    return jsonify({'msg': '회원님의 이메일로 임시 비밀번호를 전송했습니다.'})


@app.route('/passfind')
def passfind():
    return render_template('Board/account.html')

########### 구글메일 임시 종료 ##################


##################### Index ###############

@app.route('/')
def home():
    con = dbcall()
    cursor = con.cursor()
    sql = "SELECT * from company_info"
    cursor.execute(sql)
    data_list = cursor.fetchall()
    data_list = data_list
    print("인덱스타입", type(data_list))
    data_list_len = len(data_list)
    print("인덱스길이", data_list_len)
    cursor.close()

    if request.method == 'POST':
        user = request.form['coocke']
        print("쿠키테스트", user)
        resp = make_response("Cookie Setting Complete")
        resp.set_cookie('userID', user)

    return render_template('Board/index.html', data_list=data_list)


# --------------------------메뉴-----------------------------------


@app.route('/condition')  # 조건으로 찾기 - 기업정보
def condition():
    con = dbcall()
    cursor = con.cursor()

    # print('여기')
    sql = "SELECT * from company_info"
    cursor.execute(sql)
    data_list = cursor.fetchall()
    cursor.close()
    return render_template('Board/Condition.html', data_list=data_list)
    """if 'ID' in session:
        user_id=session['ID']
    else:
        user_id='null'
        
    sql = "SELECT * from company_info"
    cursor.execute(sql)
    data_list = cursor.fetchall()
    data_list = data_list

    sql = "SELECT * from like_company_view where m_id=%s"
    cursor.execute(sql,(user_id,))
    interest_com = cursor.fetchall()
    interest_len=len(interest_com)
    return render_template('Board/Condition.html',data_list=data_list,
                interest_com=interest_com,interest_len=interest_len,user_id=user_id)"""

####################################################


@app.route('/employtest')  # 체크박스 test
def employtest():
    con = dbcall()
    try:
        with con.cursor() as cursor:

            s = request.args.get('area')

            p = s.split(',')
            content = ''
            for i in range(len(p)):
                if (i+1) == len(p):
                    content += "'" + p[i] + "'"
                else:
                    content += "'" + p[i] + "',"
            print('>>>>>>>>>>>>' + content, type(content))

            print('!!!!!!!!!!!!!!!!'+content)

            sql = "SELECT * from company_info where `지역` in (" + content + ")"
            cursor.execute(sql)
            rows = cursor.fetchall()
            # print(rows)

            for row in rows:
                print('............', row)
            # return jsonify(rows)
            return rows
    finally:
        con.close()

# 찜하기 기능


@app.route('/interest_select')  # .마이페이지 찜리스트 select
def interest_select():
    con = dbcall()
    cursor = con.cursor()
    user_id = session['ID']
    sql = "SELECT * from like_company_view where m_id=%s"
    cursor.execute(sql, (user_id))
    interest_com = cursor.fetchall()
    interest_len = len(interest_com)
    cursor.close()
    return render_template('Board/interest_company.html', interest_com=interest_com, interest_len=interest_len)


@app.route('/interest_insert')  # 찜리스트 INSERT,UPDATE(DELETE)
def interest_insert():
    con = dbcall()
    cursor = con.cursor()
    rs = {}
    try:
        user_id = session['ID']
        data_id = request.args.get('data_id')
        sql = "SELECT * from like_company where id=%s and data_id=%s"
        cursor.execute(sql, (user_id, data_id))
        like_company_all = cursor.fetchall()
        print('>>>>>>', len(like_company_all))
        if (len(like_company_all) > 0):
            print('like_update')
            sql = "Update like_company SET result=%s where data_id=%s and id=%s;"
            if (like_company_all[0]['result'] == '0'):
                cursor.execute(sql, (1, data_id, user_id))
            else:
                cursor.execute(sql, (0, data_id, user_id))
            con.commit()
            cnt = cursor.rowcount
            rs = {'status': cnt}
        else:
            print('like_insert')
            sql = "insert into like_company(ID,data_id,result) values(%s,%s,%s)"
            cursor.execute(sql, (user_id, data_id, 1))
            con.commit()
            cnt = cursor.rowcount
            rs = {'status': cnt}
    except Exception as e:
        print(e)
        rs = {'status': 0}
    finally:
        cursor.close()
        return rs


########################################################


@app.route('/company/<int:data_id>')  # 기업상세페이지
def company(data_id):
    con = dbcall()
    cursor = con.cursor()
    sql = "SELECT * from company_info where data_id = %s"
    cursor.execute(sql, (data_id, ))
    data_list = cursor.fetchall()
    company = data_list[0]['industry']

    allcom = "SELECT * FROM COMPANY_INFO where industry = %s"
    cursor.execute(allcom, (company,))
    all_list = cursor.fetchall()
    all_list_len = len(all_list)
    print(all_list_len)
    cursor.close()
    return render_template('Board/company.html', data_list=data_list, all_list=all_list)


@app.route('/excellence_employment')  # 채용정보페이지
def excellence_employment():
    return render_template('Board/excellence_employment.html')


@app.route('/trend')  # 구직트렌드페이지
def trends():
    return render_template('Board/trend.html')


@app.route('/events')  # 채용정보페이지
def events():
    return render_template('Board/event.html')


@app.route('/our_company')
def our_company():
    return render_template('Board/our_company.html')


@app.route('/data')
def data():
    con = dbcall()
    cursor = con.cursor()
    sql = 'select All_Recruit,All_Employ from job_scale_total'
    cursor.execute(sql)
    data_list1 = cursor.fetchall()
    data_list1 = data_list1
    data_list_len = len(data_list1)
    print("인덱스길이data", data_list_len)
    cursor.close()
    return render_template('Board/data.html', data_list=data_list1)


@app.route('/faq')  # 질문과 답변
def faq():
    con = dbcall()
    cursor = con.cursor()
    sql = "SELECT * from faq"
    cursor.execute(sql)
    faq_list = cursor.fetchall()
    faq_len = len(faq_list)
    print(faq_len)
    cursor.close()
    return render_template('Board/faq.html', faq_list=faq_list, faq_len=faq_len)


@app.route('/qna')  # 질문게시판
def qna():
    con = dbcall()
    cursor = con.cursor()
    sql = "SELECT * from qna"
    cursor.execute(sql)
    qna_list = cursor.fetchall()
    print(qna_list)
    qna_len = len(qna_list)
    print(qna_len)

    sql2 = "SELECT count(*) from qna where reply='Y' "
    cursor.execute(sql2)
    reply = cursor.fetchone()
    reply_len = reply['count(*)']
    print("리플타입값", type(reply))
    print(reply)
    print(reply['count(*)'])
    cursor.close()
    return render_template('Board/qna.html', qna_len=qna_len, qna_list=qna_list, reply_len=reply_len)


@app.route('/question')  # 질문으로 넘기기
def qnastion():
    if session['logFlag'] == True:
        print("세션확인", session['logFlag'])
        return render_template('Board/question.html')
    else:
        return redirect('/qna')


@app.route('/question_proc', methods=['POST'])  # 질문페이지
def qustion_proc():
    con = dbcall()
    cursor = con.cursor()
    if request.method == 'POST':
        print(session['ID'])
        ID = request.form['ID']
        subject = request.form['subject']
        content = request.form['content']
    sql = "insert into qna(ID,subject,content) values(%s,%s,%s)"
    cursor.execute(sql, (ID, subject, content,))
    con.commit()
    qna_list = cursor.fetchall()
    qna_len = len(qna_list)
    print(qna_len)
    cursor.close()
    return redirect('/qna')


@app.route('/answer', methods=['POST'])  # 답변으로 넘기기
def answer():
    con = dbcall()
    cursor = con.cursor()
    if (session['logFlag'] == True) and (session['admin'] == '1'):
        print("세션확인", session['logFlag'], session['admin'])
        answer = request.form
        question_content = answer['question_content']
        idx = answer['idx']
        print(question_content)
        print("인덱스값", answer['idx'])
        print(type(idx))
        sql = 'UPDATE qna SET answer=%s, reply="Y" WHERE idx= %s'
        cursor.execute(sql, (question_content, idx, ))
        con.commit()
        cursor.close()
        return jsonify({'msg': '답변등록이 완료되었습니다.'})


@app.route('/qnaview')  # 마이페이지 나의 문의목록
def qnaview():
    con = dbcall()
    cursor = con.cursor()
    user_id = session['ID']
    sql = "SELECT * from my_qna_view where id=%s"
    cursor.execute(sql, (user_id))
    my_qna_view = cursor.fetchall()
    print(type(my_qna_view))
    my_qna_view_len = len(my_qna_view)

    date_list = []
    reply_list = []
    for i in range(my_qna_view_len):  # timestamp -> 날짜형식 변환
        print(my_qna_view[i]['create_date'])
        date_list.append(my_qna_view[i]['create_date'].strftime('%Y/%m/%d'))
        reply_list.append(my_qna_view[i]['create_date'].strftime('%Y/%m/%d'))
    print(date_list)
    print(type(date_list))
    cursor.close()
    return render_template('Board/qnaview.html', my_qna_view=my_qna_view, my_qna_view_len=my_qna_view_len, date_list=date_list, reply_list=reply_list)


@app.route('/interest')  # 찜리스트 test
def interest():
    con = dbcall()
    cursor = con.cursor()
    user_id = session['ID']
    sql = "SELECT * from like_company_view where m_id=%s"
    cursor.execute(sql, (user_id,))
    interest_com = cursor.fetchall()
    interest_len = len(interest_com)
    cursor.close()
    return render_template('Board/interest_company.html', interest_com=interest_com, interest_len=interest_len)

##################### Index ###############

##################### 로그인관련 ###############


@app.route('/login_form_get')
def login_form_get():
    return render_template('Board/login.html')


@app.route('/login_proc', methods=['POST'])
def login_proc():
    con = dbcall()
    cursor = con.cursor()

    if request.method == 'POST':  # request객체 안에 method 기능있음(자바도 마찬가지)
        # 키값(html의 name값, 변수명은 같게 만들어 주는게 편하니 습관화)
        user_id = request.form['user_id']
        user_pw = request.form['user_pw']
        pw_hash = hashlib.sha256(user_pw.encode('utf-8')).hexdigest()
        if len(user_id) == 0 or len(user_pw) == 0:
            return 'Error!! UserId or UserPw not found(null)'
        else:
            sql = 'SELECT * from member where ID =  %s '
            cursor.execute(sql, (user_id, ))
            row = cursor.fetchone()
            print(row)  # row키확인해보자 딕셔너리로 넣어주기로한걸 볼 수 있다.
            if row:
                if pw_hash == row['PW']:
                    session['logFlag'] = True
                    session['ID'] = user_id
                    session['NAME'] = row['NAME']
                    session['Phone'] = row['Phone']
                    session['BIRTH'] = row['BIRTH']
                    session['admin'] = row['admin']
                    print(session['admin'])
                    # return redirect(url_for('main'))
                    return redirect('/')
                else:
                    return ('password is def')
            else:
                return ('id not found')
    cursor.close()
    return render_template('Board/index.html')


app.secret_key = 'test_secret_key'


@app.route('/logout_proc')  # 로그아웃
def logout_proc():
    session.clear()  # 세션날림
    return redirect('/')

##################### END 로그인관련 ###############


##################### 회원가입관련 ###############


@app.route('/join_form_get')
def join_form_get():
    con = dbcall()
    cursor = con.cursor()
    idcheck = 'select ID from member'
    cursor.execute(idcheck)
    id_list = cursor.fetchall()
    print("id_list값", id_list)
    print("id_list의타입", type(id_list))
    cursor.close()
    return render_template('Board/join.html', data=json.dumps(id_list, ensure_ascii=False))


@app.route('/mailcheck', methods=['post'])
def mailcheck():
    mail = mailcall()
    # return jsonify(result = "success")
    mail_code = request.form
    check_mail = mail_code['email']
    check_code = mail_code['code']
    print("메일체크"+check_mail)
    print("코드체크"+check_code)
    msg = Message('[잡아라] 회원가입 이메일 인증번호.',
                  sender='kongjh941109@gmail.com', recipients=[check_mail])
    msg.body = ('안녕하세요! 잡아라에서 알려드립니다.\n 회원가입 이메일 인증번호를 알려드립니다.\n -인증번호 : ' +
                check_code+'\n 앞으로도 더욱 편리한 서비스를 제공하기 위해 최선을 다하겠습니다.')
    mail.send(msg)
    

    return jsonify({'msg': '회원님의 이메일로 아이디를 전송했습니다.'})


@app.route('/join_proc', methods=['GET', 'POST'])
def join_proc():
    con = dbcall()
    cursor = con.cursor()
    Idexp = re.compile('^[a-zA-Z0-9]{4,12}$')
    Idexp = re.compile('^[a-zA-Z0-9]{4,12}$')

    if request.method == 'POST':  # request객체 안에 method 기능있음(자바도 마찬가지).
        # 키값(html의 name값, 변수명은 같게 만들어 주는게 편하니 습관화)
        user_id = request.form['user_id']
        user_pw = request.form['user_pw']
        user_name = request.form['user_name']
        user_phone = request.form['user_phone']
        user_email = request.form['user_email']
        user_birth = request.form['user_birth-1'] + \
            request.form['user_birth-2'] + request.form['user_birth-3']
        print(user_birth)
        pw_hash = hashlib.sha256(user_pw.encode('utf-8')).hexdigest()

        ## 유효성 검사 ##
        REGEX_PASSWORD = '^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()])[\w\d!@#$%^&*()]{8,}$'

        """ if (user_id == ""):
            flash("ID를 입력해주세요.")
            return render_template('Board/join.html')
        if not re.fullmatch(REGEX_PASSWORD, user_pw):
            flash("비밀번호를 확인하세요." '\n' " 최소 1개 이상의 소문자, 대문자, 숫자, 특수문자로 구성되어야 하며 길이는 8자리 이상이어야 합니다.")
            return render_template('Board/join.html')
        if((user_id == True) & (Idexp.match(user_id) == True)): """

        idcheck = 'select count(*) from member where ID = %s'
        cursor.execute(idcheck, user_id)
        id_list = idcheck
        id_cnt = cursor.fetchall()
        a = (list(m['count(*)'] for m in id_cnt))
        print(a)
        print(type(a))
        if (a == [1]):
            flash("이미 존재하는 아이디입니다.")
            return render_template('Board/join.html')
        elif (a == [0]):
            sql = 'INSERT INTO member(ID, PW, email, NAME, Phone, BIRTH) VALUES(%s,%s,%s,%s,%s,%s)'
            cursor.execute(sql, (user_id, pw_hash, user_email,
                           user_name, user_phone, user_birth, ))
            con.commit()
            cursor.close()
            return render_template('Board/login.html', id_list=id_list, id_cnt=id_cnt)


##################### END 회원가입관련 ###############


##################### 마이페이지 관련 ###############
@app.route('/my_page')  # 마이페이지
def my_page():
    return render_template('Board/myPage.html')


@app.route('/my_page_proc', methods=['GET', 'POST'])
def my_page_proc():
    con = dbcall()
    cursor = con.cursor()

    if request.method == 'POST':  # request객체 안에 method 기능있음(자바도 마찬가지).
        # 키값(html의 name값, 변수명은 같게 만들어 주는게 편하니 습관화)
        user_id = request.form['user_id']
        user_pw = request.form['user_pw']
        user_name = request.form['user_name']
        user_phone = request.form['user_phone']
        user_birth = request.form['user_birth']
        if len(user_pw) == 0:
            return '에러! 입력되지 않은 값이 있습니다!'
        else:
            sql = 'UPDATE MEMBER SET PW=%s, Phone=%s WHERE ID=%s'
            cursor.execute(sql, (user_pw, user_phone, user_id, ))
            con.commit()
            cursor.close()
            return render_template('Board/login.html')


@app.route('/recent_inquiry_company')  # 활동내역 (열람기업)
def recent_inquiry_company():
    return render_template('Board/r-i-c.html')


@app.route('/personal-info-change')  # 회원정보수정
def persnal_info_change():
    return render_template('Board/personal-info-change.html')

#################### END 마이페이지 ###################


############ 미완성 및 미적용 루트 ########

@app.route('/trend')
def trend():
    return render_template('Board/trend.html')


@app.route('/chart')
def chart():
    return render_template('Board/chart.html')


@app.route('/bar')
def bar():
    return render_template('Board/bar.html')


#####################################


SECRET_KEY = "dev"

if __name__ == '__main__':
    #app.run('127.0.0.1', 5000, debug=True)
    app.run(debug=True)
