import time
import psutil


def handle_coral_dev_board_temp():

    current_temp = 0
    with open(r"/sys/class/thermal/thermal_zone0/temp") as f:
        current_temp = float(f.readline())
    return [current_temp / 1000.0]


def handle_coral_dev_board_tpu_freq():

    current_temp = handle_coral_dev_board_temp()[0]

    with open(r"/sys/class/apex/apex_0/trip_point0_temp") as f:
        trip_point2_temp = float(f.readline())
        if current_temp >= trip_point2_temp:
            return [62.5]
    with open(r"/sys/class/apex/apex_0/trip_point1_temp") as f:
        trip_point1_temp = float(f.readline())
        if current_temp >= trip_point1_temp:
            return [125.0]
    with open(r"/sys/class/apex/apex_0/trip_point0_temp") as f:
        trip_point0_temp = float(f.readline())
        if current_temp >= trip_point0_temp:
            return [250.0]
    return [500.0]


def handle_coral_dev_board_cpu_freq():
    cpu0_freq = 0
    cpu1_freq = 0
    cpu2_freq = 0
    cpu3_freq = 0

    with open(r"/sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq") as f:
        cpu0_freq = float(f.readline())
    with open(r"/sys/devices/system/cpu/cpu1/cpufreq/scaling_cur_freq") as f:
        cpu1_freq = float(f.readline())
    with open(r"/sys/devices/system/cpu/cpu2/cpufreq/scaling_cur_freq") as f:
        cpu2_freq = float(f.readline())
    with open(r"/sys/devices/system/cpu/cpu3/cpufreq/scaling_cur_freq") as f:
        cpu3_freq = float(f.readline())
    return [cpu0_freq, cpu1_freq, cpu2_freq, cpu3_freq]


def handle_firefly_rk3399_cpu_freq():
    cpu0_freq = 0
    cpu1_freq = 0
    cpu2_freq = 0
    cpu3_freq = 0
    cpu4_freq = 0
    cpu5_freq = 0

    with open(r"/sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq") as f:
        cpu0_freq = float(f.readline())
    with open(r"/sys/devices/system/cpu/cpu1/cpufreq/scaling_cur_freq") as f:
        cpu1_freq = float(f.readline())
    with open(r"/sys/devices/system/cpu/cpu2/cpufreq/scaling_cur_freq") as f:
        cpu2_freq = float(f.readline())
    with open(r"/sys/devices/system/cpu/cpu3/cpufreq/scaling_cur_freq") as f:
        cpu3_freq = float(f.readline())
    with open(r"/sys/devices/system/cpu/cpu4/cpufreq/scaling_cur_freq") as f:
        cpu4_freq = float(f.readline())
    with open(r"/sys/devices/system/cpu/cpu5/cpufreq/scaling_cur_freq") as f:
        cpu5_freq = float(f.readline())

    return [cpu0_freq, cpu1_freq, cpu2_freq, cpu3_freq, cpu4_freq, cpu5_freq]


def handle_firefly_rk3399_gpu_freq():
    with open(r"/sys/devices/system/cpu/cpufreq/policy4/cpuinfo_cur_freq") as f:
        return [float(f.readline())]


def handle_firefly_rk3399_temp():
    thermal_zone0 = 0
    thermal_zone1 = 0
    with open(r"/sys/devices/virtual/thermal/thermal_zone0/temp") as f:
        thermal_zone0 = float(f.readline())
    with open(r"/sys/devices/virtual/thermal/thermal_zone1/temp") as f:
        thermal_zone1 = float(f.readline())
    return [thermal_zone0, thermal_zone1]


def get_cpu_usage():
    return psutil.cpu_percent(interval=1, percpu=True)


def get_memory_usage():
    return [psutil.virtual_memory()[3] / (1024*1024)]


def handle_coral_dev_board_cpu_times():
    return psutil.cpu_times_percent()


def handle_coral_dev_board_cpu_stats():
    return psutil.cpu_stats()

