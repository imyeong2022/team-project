from flask import Flask, redirect, url_for, render_template, request , flash, jsonify
from flask import request, session
from flask_mail import Mail, Message
import pymysql, hashlib, json, re

# 2022 11 10 병합작업 1차버전입니다.
########### 데이터베이스 접속 전역변수 선언############
con = pymysql.connect(host='localhost',
                      user='root',
                      password='java',
                      db='final_test',
                      charset='utf8mb4',
                      cursorclass=pymysql.cursors.DictCursor)
cursor = con.cursor()
########### 데이터베이스 접속 전역변수 선언############
app = Flask(__name__)
############ 구글메일(계정찾기 테스트) ################ 사이트 접근과 동시에 메일서버와 인터페이스 하면서 recipients 로 지정된 메일 주소로 이메일을 발송
# app.config['MAIL_SERVER'] = 'smtp.gmail.com'
# app.config['MAIL_PORT'] = 465
# app.config['MAIL_USERNAME'] = 'kongjh941109@gmail.com'
# app.config['MAIL_PASSWORD'] = 'myhinigkzocytxcd'
# app.config['MAIL_USE_TLS'] = False
# app.config['MAIL_USE_SSL'] = True
#mail = Mail(app)


@app.route('/accountfind')
def accountfind():
    sql = "SELECT ID,email,phone from member"
    cursor.execute(sql)
    userlist2 = cursor.fetchall()
    print(type(userlist2))
    print(userlist2)

    return render_template('Board/account.html')

#@app.route('/accountfind_proc', methods=['POST'])
#def accountfind_proc():
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

    return jsonify({'msg': '회원님의 이메일로 아이디를 전송했습니다.'})


@app.route('/passwordfind')
def passwordfind():
    sql = "SELECT ID,email,phone from member"
    cursor.execute(sql)
    userlist2 = cursor.fetchall()
    print(type(userlist2))
    print(userlist2)

    return render_template('Board/accountpassword.html')


@app.route('/passwordfind_proc', methods=['POST'])
def passwordfind_proc():
    user_name_recive = request.form['user_name_give']
    user_id_recive = request.form['user_id_give']
    user_phone_recive = request.form['user_phone_give']
    code = request.form['code']
    # sql = "UPDATE member SET member.PW = %s where email in(SELECT email from (select email from member where name = %s and id = %s and phone=%s)as TMP)"
    # 서브쿼리로 처리해보려고했으나 email값을 변수로 사용을 못함... 다중sql문 쓰는게 맞을듯함
    sql = "SELECT email from member where name = %s and id = %s and phone=%s"
    cursor.execute(sql, (user_name_recive, user_id_recive, user_phone_recive, ))
    find_useremail = cursor.fetchone()
    sendmail = find_useremail['email']
    re_pw_hash = hashlib.sha256(code.encode('utf-8')).hexdigest()
    sql2 = "update member set pw = %s where email = %s"
    cursor.execute(sql2, (re_pw_hash, sendmail, ))
    con.commit()

    msg = Message('[잡아라]에 요청하신 임시비밀번호입니다.',
                  sender='kongjh941109@gmail.com', recipients=[sendmail])
    msg.body = user_name_recive + \
        '님 안녕하세요.\n 임시 비밀번호를 발급하오니 잡아라 홈페이지에 오셔서 로그인 하신 후.' + \
            ' \n 마이페이지>>개인정보변경에서 반드시 비밀번호를 변경하여 주시기 바랍니다. ' + \
            ' \n 임시비밀번호  :  ' +code + \
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
    sql = "SELECT * from company_info"
    cursor.execute(sql)
    data_list = cursor.fetchall()
    data_list = data_list
    print("인덱스타입", type(data_list))
    data_list_len = len(data_list)
    print("인덱스길이", data_list_len)

    return render_template('Board/index.html', data_list=data_list)


# --------------------------메뉴-----------------------------------
@app.route('/condition',methods=['GET'])  # 조건으로 찾기 - 기업정보
def condition():
    # print('여기')
    sql = "SELECT * from company_info"
    cursor.execute(sql)
    data_list=cursor.fetchall()

    return render_template('Board/Condition.html', data_list=data_list)

def company(data_id):
    sql = "SELECT * from company_info where data_id = %s"
    cursor.execute(sql, (data_id,))
    data_list = cursor.fetchall()
    
 #동종업계 추천하기
    recommendation =data_list[0]['industry']
    print(recommendation)
    allcom = "SELECT * FROM COMPANY_INFO where industry = %s" 
    cursor.execute(allcom,(recommendation,))
    all_list = cursor.fetchall()
    return render_template('Board/company.html', data_list=data_list, all_list=all_list)

@app.route('/search', methods=['GET'])  # 조건으로 찾기 - 기업정보
def search():
    with con.cursor() as cursor:  
        s=request.args.get('area') 
        p = s.split(',')
        content = ''
        for i in range(len(p)):
            if (i+1) == len(p):                    
                content += "'" + p[i] + "'"
            else:
                content += "'" + p[i] + "',"
        print('>>>>>>>>>>>>'+ content,type(content))
        print('!!!!!!!!!!!!!!!!'+content)
        sql="SELECT * from company_info where `region` in ("+ content +")"
        cursor.execute(sql)
        rows=cursor.fetchall()
        for row in rows:
            print('............',row)
        return rows

@app.route('/employtest') # 체크박스 test
def employtest():
    try:
        with con.cursor() as cursor:
            
            s=request.args.get('area') 
            p = s.split(',')
            content = ''
            for i in range(len(p)):
                if (i+1) == len(p):                    
                    content += "'" + p[i] + "'"
                else:
                    content += "'" + p[i] + "',"
            print('>>>>>>>>>>>>'+ content,type(content))

            print('!!!!!!!!!!!!!!!!'+content)
            
            sql="SELECT * from company_info where `region` in ("+ content +")"
            cursor.execute(sql)
            rows=cursor.fetchall()
            # print(rows)
            for row in rows:
                print('............',row)
            return rows        
    finally:
        con.close()


@app.route('/interest') ###############찜리스트 select
def interest():
    user_id=session['ID']
    sql = "SELECT * from like_company_view where m_id=%s"
    cursor.execute(sql,(user_id,))
    interest_com = cursor.fetchall()
    interest_len = len(interest_com)
    return render_template('Board/interest_company.html', interest_com=interest_com,interest_len=interest_len)



########################################################


@app.route('/company/<int:data_id>')  ############ 기업상세페이지
def company(data_id):
    sql = "SELECT * from company_info where data_id = %s"
    cursor.execute(sql, (data_id,))
    data_list = cursor.fetchall()
    
    #동종업계 추천하기
    recommendation =data_list[0]['industry']
    print(recommendation)
    allcom = "SELECT * FROM COMPANY_INFO where industry = %s" 
    cursor.execute(allcom,(recommendation,))
    all_list = cursor.fetchall()
    return render_template('Board/company.html', data_list=data_list, all_list=all_list)

@app.route('/test_script')  ################# 자바스크립트 필터 연습 페이지1
def test_script():
    return render_template('Board/test_script.html')



    allcom = "SELECT * FROM COMPANY_INFO where 업종 = %s" 
    cursor.execute(allcom,(company,))
    all_list = cursor.fetchall()
    return render_template('Board/company.html', data_list=data_list, all_list=all_list)


@app.route('/excellence_employment') ###############채용정보페이지
def excellence_employment():
    return render_template('Board/excellence_employment.html')


@app.route('/trend')  ################# 구직트렌드페이지 
def trends():
    return render_template('Board/trend.html')

@app.route('/events')  ################# 채용정보페이지
def events():
    return render_template('Board/event.html')

@app.route('/our_company')
def our_company():
    return render_template('Board/our_company.html')


@app.route('/data')
def data():
    sql ='select All_Recruit,All_Employ from job_scale_total'
    cursor.execute(sql)
    data_list1 = cursor.fetchall()
    data_list1 = data_list1
    data_list1 = data_list1
    data_list_len = len(data_list1)
    print("인덱스길이data", data_list_len)
   
    return render_template('Board/data.html', data_list=data_list1)


@app.route('/faq')  # 질문과 답변
def faq():
    sql = "SELECT * from faq"
    cursor.execute(sql)
    faq_list = cursor.fetchall()
    faq_len = len(faq_list)
    print(faq_len)

    return render_template('Board/faq.html', faq_list=faq_list, faq_len=faq_len)


@app.route('/qna')  # 질문게시판
def qna():
    sql = "SELECT * from qna"
    cursor.execute(sql)
    qna_list = cursor.fetchall()
    qna_len = len(qna_list)
    print(qna_len)
    return render_template('Board/qna.html', qna_len=qna_len, qna_list=qna_list)


@app.route('/question')  # 질문으로 넘기기
def qnastion():
    if session['logFlag'] == True:
        print("세션확인", session['logFlag'])
        return render_template('Board/question.html')
    else:
        return redirect('/qna')


@app.route('/question_proc', methods=['POST'])  # 질문페이지
def qustion_proc():
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

    return redirect('/qna')

@app.route('/interest') ###############찜리스트 test
def interest():
    user_id=session['ID']
    sql = "SELECT * from like_company_view where m_id=%s"
    cursor.execute(sql,(user_id,))
    interest_com = cursor.fetchall()
    interest_len = len(interest_com)
    return render_template('Board/interest_company.html', interest_com=interest_com,interest_len=interest_len)

##################### Index ###############

##################### 로그인관련 ###############


@app.route('/login_form_get')
def login_form_get():
    return render_template('Board/login.html')


@app.route('/login_proc', methods=['POST'])
def login_proc():

    if request.method == 'POST':  # request객체 안에 method 기능있음(자바도 마찬가지).
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
    idcheck = 'select ID from member'
    cursor.execute(idcheck)
    id_list = cursor.fetchall()
    print("id_list값", id_list)
    print("id_list의타입", type(id_list))
    return render_template('Board/join.html', data=json.dumps(id_list, ensure_ascii=False))


@app.route('/mailcheck', methods=['post'])
def mailcheck():
    value = request.form
    print(value)
    print(value['email'])
    print(value['code'])

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
            return render_template('Board/login.html', id_list=id_list, id_cnt=id_cnt)


##################### END 회원가입관련 ###############


##################### 마이페이지 관련 ###############
@app.route('/my_page')  # 마이페이지
def my_page():
    return render_template('Board/myPage.html')


@app.route('/my_page_proc', methods=['GET', 'POST'])
def my_page_proc():

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
