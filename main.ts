let 行进命令类型 = 0
let 舵机运行时间 = 0
let 舵机角度 = 0
let 舵机号 = 0
let 命令类型 = 0
let 蓝牙命令字符 = ""
StartbitV2.startbit_Init()
basic.showLeds(`
    . . # . .
    # . # # .
    . # # . .
    # . # # .
    . . # . .
    `)
basic.forever(function () {
    蓝牙命令字符 = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Dollar))
    命令类型 = StartbitV2.startbit_analyzeBluetoothCmd(蓝牙命令字符)
    if (命令类型 == StartbitV2.startbit_getBluetoothCmdtype(StartbitV2.startbit_CmdType.VERSION)) {
        bluetooth.uartWriteString("CMD|0A|81|$")
    }
    if (命令类型 == StartbitV2.startbit_getBluetoothCmdtype(StartbitV2.startbit_CmdType.ULTRASONIC)) {
        bluetooth.uartWriteString(StartbitV2.startbit_convertUltrasonic(StartbitV2.startbit_ultrasonic()))
    }
    if (命令类型 == StartbitV2.startbit_getBluetoothCmdtype(StartbitV2.startbit_CmdType.TEMPERATURE)) {
        bluetooth.uartWriteString(StartbitV2.startbit_convertTemperature(input.temperature()))
    }
    if (命令类型 == StartbitV2.startbit_getBluetoothCmdtype(StartbitV2.startbit_CmdType.LIGHT)) {
        bluetooth.uartWriteString(StartbitV2.startbit_convertLight(input.lightLevel()))
    }
    if (命令类型 == StartbitV2.startbit_getBluetoothCmdtype(StartbitV2.startbit_CmdType.RGB_LIGHT)) {
        StartbitV2.startbit_setPixelRGBArgs(StartbitLights.Light1, StartbitV2.startbit_getArgs(蓝牙命令字符, 1))
        StartbitV2.startbit_setPixelRGBArgs(StartbitLights.Light2, StartbitV2.startbit_getArgs(蓝牙命令字符, 1))
        StartbitV2.startbit_showLight()
    }
    if (命令类型 == StartbitV2.startbit_getBluetoothCmdtype(StartbitV2.startbit_CmdType.SERVO)) {
        舵机号 = StartbitV2.startbit_getArgs(蓝牙命令字符, 1)
        舵机角度 = StartbitV2.startbit_getArgs(蓝牙命令字符, 2)
        舵机运行时间 = StartbitV2.startbit_getArgs(蓝牙命令字符, 3)
        if (舵机号 == 1) {
            StartbitV2.setPwmServo(StartbitV2.startbit_servorange.range1, 舵机号, 舵机角度, 舵机运行时间)
        } else if (舵机号 == 2) {
            if (舵机角度 > 95) {
                舵机角度 = 95
            }
            if (舵机角度 <= 30) {
                舵机角度 = 30
            }
            StartbitV2.setPwmServo(StartbitV2.startbit_servorange.range1, 舵机号, 舵机角度, 舵机运行时间)
        } else if (舵机号 == 3) {
            if (舵机角度 >= 140) {
                舵机角度 = 140
            }
            if (舵机角度 <= 85) {
                舵机角度 = 85
            }
            StartbitV2.setPwmServo(StartbitV2.startbit_servorange.range1, 舵机号, 舵机角度, 舵机运行时间)
        }
    }
    if (命令类型 == StartbitV2.startbit_getBluetoothCmdtype(StartbitV2.startbit_CmdType.CAR_RUN)) {
        行进命令类型 = StartbitV2.startbit_getArgs(蓝牙命令字符, 1)
        if (行进命令类型 == StartbitV2.startbit_getRunCarType(StartbitV2.startbit_CarRunCmdType.STOP)) {
            bluetooth.uartWriteString("CMD|01|00|$")
            StartbitV2.startbit_setMotorSpeed(0, 0)
        }
        if (行进命令类型 == StartbitV2.startbit_getRunCarType(StartbitV2.startbit_CarRunCmdType.GO_AHEAD)) {
            bluetooth.uartWriteString("CMD|01|01|$")
            StartbitV2.startbit_setMotorSpeed(90, 90)
        }
        if (行进命令类型 == StartbitV2.startbit_getRunCarType(StartbitV2.startbit_CarRunCmdType.GO_BACK)) {
            bluetooth.uartWriteString("CMD|01|02|$")
            StartbitV2.startbit_setMotorSpeed(-90, -90)
        }
        if (行进命令类型 == StartbitV2.startbit_getRunCarType(StartbitV2.startbit_CarRunCmdType.TURN_LEFT)) {
            bluetooth.uartWriteString("CMD|01|03|$")
            StartbitV2.startbit_setMotorSpeed(90, -90)
        }
        if (行进命令类型 == StartbitV2.startbit_getRunCarType(StartbitV2.startbit_CarRunCmdType.TURN_RIGHT)) {
            bluetooth.uartWriteString("CMD|01|04|$")
            StartbitV2.startbit_setMotorSpeed(-90, 90)
        }
    }
})
