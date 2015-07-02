//: Playground - noun: a place where people can play

import UIKit

var str = "Hello, playground"

var img = UIImage(named: "switchCamera")
var view = UIImageView(image:img)
view.frame = CGRect(x: 20, y: 20, width: 20, height: 20)
var ivc = UIViewController()
ivc.view = view

