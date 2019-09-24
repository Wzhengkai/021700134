import re #引入模块re

import json #引入模块json



cache = input('请输入地址：')  #input为输入函数



dict = {}

'''字典：键必须是唯一的，但值则不必。
值可以取任何数据类型，但键必须是不可变的，如字符串，数字或元组。
eg:
dict = {'Name': 'Runoob', 'Age': 7, 'Class': 'First'} 
print ("dict['Name']: ", dict['Name'])
print ("dict['Age']: ", dict['Age'])
'''

list = []
'''列表：列表的数据项不需要具有相同的类型
创建一个列表，只要把逗号分隔的不同的数据项使用方括号括起来即可
eg：
list1 = ['Google', 'Runoob', 1997, 2000];
list2 = [1, 2, 3, 4, 5, 6, 7 ];
print ("list1[0]: ", list1[0])
print ("list2[1:5]: ", list2[1:5])
'''



print('{', end='')



cache = re.sub('\d!','',cache)
name = re.search('.+,', cache).group()  #提取名字

dict["姓名"] = re.search('[^,]+', name).group()

cache = re.sub('.+,', '', cache)



dict["手机"]= re.search('\d{11}', cache).group()  #提取号码

cache = re.sub('\d{11}', '', cache)



aaa = re.search('.{2}', cache).group()  #省

flag = re.match('.+?省', cache)

if aaa == '北京' or aaa == '天津' or aaa == '重庆' or aaa == '上海' :

    list.append(aaa)

elif flag != None :

    aaa = re.search('.+?省', cache).group()

    cache = cache.replace(aaa, '', 1)

    list.append(aaa)

else:

    aaa = re.search('..', cache).group()

    cache = cache.replace(aaa, '', 1)

    list.append(aaa+'省')



flag = re.match('.+?市', cache)  #市

if flag != None :

    aaa = re.search('.+?市', cache).group()

    cache = cache.replace(aaa, '', 1)

    list.append(aaa)

else:

    aaa = re.search('..', cache).group()

    cache = cache.replace(aaa, '', 1)

    list.append(aaa+'市')



flag = re.match('.+?(?:县|区)', cache)  #县/区

if flag != None :

    aaa = re.search('.+?(?:县|区)', cache).group()

    cache = cache.replace(aaa, '', 1)

    list.append(aaa)

else:

    list.append('')



flag = re.match('..+?(?:镇|街道)', cache)  #镇/街道/乡

if flag != None :

    aaa = re.search('..+?(?:镇|街道|乡)', cache).group()

    cache = cache.replace(aaa, '', 1)

    list.append(aaa)

else:

    list.append('')



flag = re.search('.+?(?:路|巷|街|道|乡)', cache)  #路/巷/街

if flag != None :

    aaa = re.search('.+?(?:路|巷|街|道|乡)', cache).group()

    cache = cache.replace(aaa, '', 1)

    list.append(aaa)

else:

    list.append('')



flag = re.match('.+?(?:号|村)', cache).group()  #号

flag1 = re.match('.+委会', cache).group()

flag1 = flag1.replace(flag, '', 1)

if (flag != None) and (flag1 != "委会") :

    aaa = re.search('.+?(?:号|村)', cache).group()

    cache = cache.replace(aaa, '', 1)

    list.append(aaa)

else:

    list.append('')



flag = re.match('[^\.]+', cache)  #具体地址

if flag != None :

    aaa = re.search('[^\.]+', cache).group()

    list.append(aaa)

else:

    list.append('')



dict['地址'] = list

j = json.dumps(dict,ensure_ascii=False)

print(j)  #结束