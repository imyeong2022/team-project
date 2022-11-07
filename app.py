from flask import Flask, redirect, url_for, render_template, request
from flask import request, session
import pymysql

###########데이터베이스 접속 전역변수 선언############
con = pymysql.connect(host='localhost',
                             user='root',
                             password='java',
                             db='final_test',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)
cursor = con.cursor() 
###########데이터베이스 접속 전역변수 선언############

app = Flask(__name__)
##################### Index ###############
@app.route('/')
def home():
    sql = "SELECT * from recruitment"
    cursor.execute(sql)
    data_list = cursor.fetchall()
    print(type(data_list))
    #print(data_list)
    print(data_list[0]["기업명칭"])
    #print(data_list[1]["기업명칭"])
    #print(data_list[2]["기업명칭"])
    data_list = data_list
    print(type(data_list))

    for i in data_list:
     #print(i)
     #print(type(i))
     print(i["기업명칭"])
    return render_template('Board/index.html', data_list=data_list)
##################### Index ###############

##################### 로그인관련 ###############
@app.route('/login_form_get')
def login_form_get():
    return render_template('Board/login.html')

@app.route('/login_proc', methods=['POST'])
def login_proc():

    if request.method == 'POST': #request객체 안에 method 기능있음(자바도 마찬가지).
        user_id = request.form['user_id'] #키값(html의 name값, 변수명은 같게 만들어 주는게 편하니 습관화)
        user_pw = request.form['user_pw']
        if len(user_id) == 0 or len(user_pw) == 0:
            return 'Error!! UserId or UserPw not found(null)'
        else:
            sql = 'SELECT ID, PW, NAME from member where ID =  %s '
            cursor.execute(sql, (user_id, ))
            row = cursor.fetchone()
            print(row) # row키확인해보자 딕셔너리로 넣어주기로한걸 볼 수 있다.
            if row:
                if user_pw == row['PW']:
                 session['logFlag'] = True
                 session['ID'] = user_id
                 session['NAME'] = row['NAME']
                 #return redirect(url_for('main'))
                 return redirect('/')
                else:
                 return ('password is def')
            else:
                return ('id not found')
    cursor.close()            
    return render_template('Board/index.html')

app.secret_key = 'test_secret_key'

@app.route('/logout_proc')
def logout_proc():
    if session['logFlag'] == True:
        session['logFlag'] = False
    return render_template('Board/header.html') 
#    return render_template('Board/index.html') 으로 할시 data_list undefined 나와서, 임시로 header로 연결했습니다.

        


##################### 로그인관련 ###############


##################### 회원가입관련 ###############
@app.route('/join_form_get')
def join_form_get():
    return render_template('Board/join.html')

@app.route('/join_proc', methods=['POST'])
def join_proc():

    if request.method == 'POST': #request객체 안에 method 기능있음(자바도 마찬가지).
        user_id = request.form['user_id'] #키값(html의 name값, 변수명은 같게 만들어 주는게 편하니 습관화)
        user_pw = request.form['user_pw']
        user_name = request.form['user_name'] #키값(html의 name값, 변수명은 같게 만들어 주는게 편하니 습관화)
        user_phone = request.form['user_phone']
        user_birth = request.form['user_birth']
        if len(user_id) == 0 or len(user_pw) == 0:
            return '에러! 입력되지 않은 값이 있습니다!'
        else:
            sql = 'INSERT INTO member(ID, PW, NAME, Phone, BIRTH) VALUES(%s,%s,%s,%s,%s)'
            cursor.execute(sql, (user_id,user_pw, user_name, user_phone, user_birth, ))
            con.commit()
            cursor.close()
            return render_template('Board/login.html')

##################### END 회원가입관련 ###############  


##################### 마이페이지 관련 ###############
@app.route('/my_page') #마이페이지
def my_page():
    return render_template('Board/myPage.html')

@app.route('/my_page_proc', methods=['GET','POST'])
def my_page_proc():

    if request.method == 'POST': #request객체 안에 method 기능있음(자바도 마찬가지).
        user_id = request.form['user_id'] #키값(html의 name값, 변수명은 같게 만들어 주는게 편하니 습관화)
        user_pw = request.form['user_pw']
        user_name = request.form['user_name'] #키값(html의 name값, 변수명은 같게 만들어 주는게 편하니 습관화)
        user_phone = request.form['user_phone']
        user_birth = request.form['user_birth']
        if len(user_pw) == 0:
            return '에러! 입력되지 않은 값이 있습니다!'
        else:
            sql =  'UPDATE MEMBER SET PW=%s, Phone=%s WHERE ID=%s'
            cursor.execute(sql, (user_pw,user_phone,user_id, ))
            con.commit()
            
            return render_template('Board/login.html')

#################### END 마이페이지 ###################

@app.route('/condition') #상세검색기능
def condition():
    return render_template('Board/Condition.html')
    
@app.route('/faq') # 질문과 답변
def faq():
    return render_template('Board/faq.html')

@app.route('/test') # 질문과 답변
def company():
    return render_template('Board/company.html')

if __name__ == '__main__':
    #app.run('127.0.0.1', 5000, debug=True)
    app.run(debug=True)
