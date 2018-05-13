use mvnbook;

drop table if exists navigate;
create table navigate (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  treeid varchar(3) not null,
  text varchar(32) not null,
  state varchar(6) not null default 'closed',
  checked tinyint unsigned not null default 0,
  iconCls varchar(30),
  power tinyint unsigned not null default 9,
  attr_level tinyint unsigned not null default 1,
  attr_isleaf tinyint unsigned not null default 1,
  attr_parents tinyint unsigned not null default 0,
  attr_url varchar(32) not null default '',
  CreateTime bigint unsigned not null default 0,
  UpdateTime bigint unsigned not null default 0,
  Status char(1) not null default 'N',
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

LOCK TABLES navigate WRITE;
insert into navigate (treeid,text,state,checked,iconCls,power,attr_level,attr_isleaf,attr_parents,attr_url,CreateTime,UpdateTime,Status) values
(9,'系统管理','closed',0,'icon-system',1,1,0,0,'#',1467725966324,1467725966324,'N'),
(901,'系统角色管理','open',0,'icon-role',1,2,1,9,'sysrole/sysroles.html',1467725966324,1467725966324,'N'),
(902,'系统帐号管理','open',0,'icon-user',1,2,1,9,'sysrole/sysaccts.html',1467725966324,1467725966324,'N'),
(990,'系统导航栏管理','open',0,'icon-tree',0,2,1,9,'sysrole/navmanager.html',1467725966324,1467725966324,'N');
insert into navigate (treeid,text,state,checked,iconCls,power,attr_level,attr_isleaf,attr_parents,attr_url,CreateTime,UpdateTime,Status) values
(8,'基础表数据','closed',0,'icon-db',1,1,0,0,'#',1467725966324,1468065780651,'U'),
(801,'书籍库','open',0,'icon-table',1,2,1,8,'table/books.html',1467725966324,1467725966324,'D'),
(802,'评价库','open',0,'icon-table',1,2,1,8,'table/appraises.html',1467725966324,1467725966324,'D'),
(803,'评价类别库','open',0,'icon-table',1,2,1,8,'table/recommend.html',1467725966324,1467725966324,'D'),
(804,'版况库','open',0,'icon-table',1,2,1,8,'table/pubversion.html',1467725966324,1467725966324,'D'),
(805,'系库','open',0,'icon-table',1,2,1,8,'table/faculty.html',1467725966324,1467725966324,'D'),
(806,'专业名称库','open',0,'icon-table',1,2,1,8,'table/specfield.html',1467725966324,1467725966324,'D'),
(807,'承担单位库','open',0,'icon-table',1,2,1,8,'table/department.html',1467725966324,1467725966324,'D'),
(808,'教研室库','open',0,'icon-table',1,2,1,8,'table/staffroom.html',1467725966324,1467725966324,'D'),
(809,'教师库','open',0,'icon-table',1,2,1,8,'table/teacher.html',1467725966324,1467725966324,'D'),
(810,'班级库','open',0,'icon-table',1,2,1,8,'table/class.html',1467725966324,1467725966324,'D'),
(811,'学年库','open',0,'icon-table',1,2,1,8,'table/schoolyear.html',1467725966324,1467725966324,'D'),
(812,'出版社库','open',0,'icon-table',1,2,1,8,'table/pubhouse.html',1467725966324,1467725966324,'D'),
(813,'学期库','open',0,'icon-table',1,2,1,8,'table/terms.html',1467725966324,1467725966324,'D'),
(814,'课程库','open',0,'icon-table',1,2,1,8,'table/lesson.html',1467725966324,1467725966324,'D');
insert into navigate (treeid,text,state,checked,iconCls,power,attr_level,attr_isleaf,attr_parents,attr_url,CreateTime,UpdateTime,Status) values
(7,'评价统计','closed',0,'icon-sum',2,1,0,0,'#',1467725966324,1467725966324,'N'),
(701,'评价信息录入','open',0,'icon-statistics',1,2,1,7,'appraise/appraise.html',1467725966324,1467725966324,'D'),
(702,'推荐查询','open',0,'icon-statistics',2,2,1,7,'appraise/apprec.html',1467881114342,1467883292793,'D'),
(703,'评价详情','open',0,'icon-statistics',2,2,1,7,'appraise/appdetail.html',1468035767706,1468035767706,'N'),
(704,'使用历史','open',0,'icon-history',2,2,1,7,'appraise/history.html',1468035879079,1468036148591,'U'),
(705,'教材查询','open',0,'icon-book',2,2,1,7,'table/books.html',1468065859879,1468065859879,'D'),
(706,'调查表','open',0,'',2,2,1,7,'appraise/newappraise.html',1479229798988,1479229798988,'D'),
(707,'班级统计','open',0,'icon-user',2,2,1,7,'appraise/glasstj.html',1479229798988,1479229798988,'N'),
(708,'教材统计','open',0,'icon-book',2,2,1,7,'appraise/jiaocaitj.html',1479229798988,1479229798988,'N'),
(709,'教师统计','open',0,'icon-role',2,2,1,7,'appraise/jiaoshitj.html',1479229798988,1479229798988,'N'),
(890,'Excel导入','open',0,'icon-table',1,2,1,8,'table/importfile.html',1480085209153,1480085248032,'U');
UNLOCK TABLES;

drop table if exists account;
create table account (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  uid int unsigned not null,
  phone char(11) not null,
  password char(32) not null,
  nickname varchar(32),
  power tinyint unsigned not null default 9,
  CreateUid int unsigned not null default 0,
  CreateTime bigint unsigned not null default 0,
  UpdateTime bigint unsigned not null default 0,
  Status char(1) not null default 'N',
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

drop table if exists roles;
create table roles (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  code tinyint unsigned not null,
  value varchar(24) not null,
  CreateTime bigint unsigned not null default 0,
  UpdateTime bigint unsigned not null default 0,
  Status char(1) not null default 'N',
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;
insert into roles (code,value,CreateTime,UpdateTime,Status) values (1,'管理员',1467725627980,1467725627980,'N');
insert into roles (code,value,CreateTime,UpdateTime,Status) values (2,'教材',1467725627980,1467725627980,'N');

drop table if exists diaocha_teacher;
create table diaocha_teacher (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  uuid char(32) not null,
  Q1_1 tinyint unsigned not null default 0,
  Q1_2 tinyint unsigned not null default 0,
  Q1_3 tinyint unsigned not null default 0,
  Q1_4 tinyint unsigned not null default 0,
  Q2_1 tinyint unsigned not null default 0,
  Q2_2 tinyint unsigned not null default 0,
  Q2_3 tinyint unsigned not null default 0,
  Q3_1 tinyint unsigned not null default 0,
  Q3_2 tinyint unsigned not null default 0,
  Q3_3 tinyint unsigned not null default 0,
  Q1_sum tinyint unsigned not null default 0,
  Q4_1 tinyint unsigned not null default 0,
  Q4_2 tinyint unsigned not null default 0,
  Q5_1 tinyint unsigned not null default 0,
  Q5_2 tinyint unsigned not null default 0,
  Q6_1 tinyint unsigned not null default 0,
  Q6_2 tinyint unsigned not null default 0,
  Q7_1 tinyint unsigned not null default 0,
  Tcomments varchar(255),
  CreateTime bigint unsigned not null default 0,
  UpdateTime bigint unsigned not null default 0,
  Status char(1) not null default 'N',
  PRIMARY KEY (id),
  key idx_diaocha_teacher_uuid (uuid)
) DEFAULT CHARSET=utf8;

drop table if exists diaocha_student;
create table diaocha_student (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  uuid char(32) not null,
  xuehao varchar(10) not null,
  Q1_1 tinyint unsigned not null default 0,
  Q1_2 tinyint unsigned not null default 0,
  Q1_3 tinyint unsigned not null default 0,
  Q1_4 tinyint unsigned not null default 0,
  Q1_5 tinyint unsigned not null default 0,
  Q1_6 tinyint unsigned not null default 0,
  Q1_7 tinyint unsigned not null default 0,
  Q1_8 tinyint unsigned not null default 0,
  Q1_9 tinyint unsigned not null default 0,
  Q1_10 tinyint unsigned not null default 0,
  Q1_sum tinyint unsigned not null default 0,
  Q2_1 tinyint unsigned not null default 0,
  Q2_2 tinyint unsigned not null default 0,
  Q3_1 tinyint unsigned not null default 0,
  Q3_2 tinyint unsigned not null default 0,
  Scomments varchar(255),
  CreateTime bigint unsigned not null default 0,
  UpdateTime bigint unsigned not null default 0,
  Status char(1) not null default 'N',
  PRIMARY KEY (id),
  key idx_diaocha_student_uuid (uuid)
) DEFAULT CHARSET=utf8;

drop table if exists diaocha_result_uuid;
create table diaocha_result_uuid (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  uuid char(32) not null,
  banji varchar(64) not null,
  isbn varchar(64) not null,
  jiaoshi_id char(8) not null,
  renshu_s int unsigned not null default 0,
  Q1_sum_s int unsigned not null default 0,
  renshu_t int unsigned not null default 0,
  Q1_sum_t int unsigned not null default 0,
  Q3_1_s_yes int unsigned not null default 0,
  Q3_1_s_no int unsigned not null default 0,
  Q3_2_s_tj int unsigned not null default 0,
  Q3_2_s_mq int unsigned not null default 0,
  Q3_2_s_no int unsigned not null default 0,
  Q3_2_t_tj int unsigned not null default 0,
  Q3_2_t_mq int unsigned not null default 0,
  Q3_2_t_no int unsigned not null default 0,
  Scomments longtext,
  Tcomments longtext,
  CreateTime bigint unsigned not null default 0,
  UpdateTime bigint unsigned not null default 0,
  Status char(1) not null default 'N',
  PRIMARY KEY (id),
  key idx_diaocha_result_uuid_uuid (uuid),
  key idx_diaocha_result_uuid_banji (banji),
  key idx_diaocha_result_uuid_isbn (isbn),
  key idx_diaocha_result_uuid_jiaoshi (jiaoshi_id)
) DEFAULT CHARSET=utf8 comment='以班级教材生成统计结果';

drop table if exists diaocha_jiaocai;
create table diaocha_jiaocai (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  uuid char(32) not null,
  term varchar(64),
  yuanxi varchar(64),
  danwei varchar(64),
  zhuanye varchar(64),
  banji varchar(64),
  renshu varchar(64),
  kecheng_id char(9),
  kecheng varchar(64),
  jiaoshi_id char(8),
  jiaoshi varchar(16),
  zhiwu varchar(8),
  isbn varchar(64),
  jiaocai varchar(64),
  banbie varchar(64),
  bankuang varchar(64),
  zuozhe varchar(64),
  dingjia varchar(64),
  CreateTime bigint unsigned not null default 0,
  UpdateTime bigint unsigned not null default 0,
  Status char(1) not null default 'N',
  PRIMARY KEY (id),
  key idx_diaocha_jiaocai_uuid (uuid)
) DEFAULT CHARSET=utf8;

drop table if exists students;
create table students (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  xuehao varchar(20) not null,
  xingming varchar(12),
  yuanxi varchar(20),
  zhuanye varchar(20),
  banji varchar(20),
  biyedate int unsigned default 0,
  CreateTime bigint unsigned not null default 0,
  UpdateTime bigint unsigned not null default 0,
  Status char(1) not null default 'N',
  PRIMARY KEY (id),
  key idx_students_xuehao (xuehao)
) DEFAULT CHARSET=utf8;
