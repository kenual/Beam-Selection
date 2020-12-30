# Floor Beam Calculation

# Dependency
import numpy as np
import json

# Input
BeamName = "RB"
BeamNum = 1
BeamLength = 15
loadings = [
    {'type': 1, 'w': 100},
    {'type': 2, 'p': 1000, 'l1': 5},
    {'type': 2, 'p': 1000, 'l1': 5},
    {'type': 2, 'p': 1000, 'l1': 5},
    {'type': 2, 'p': 1000, 'l1': 5},
    {'type': 2, 'p': 1000, 'l1': 5},
    {'type': 3, 'w': 100},
    {'type': 4, 'w': 100, 'l1': 2.5, 'l2': 6}
]

# Formula definitions


def calcPoints(l):
    unit = l / 10
    points = np.arange(unit, l, unit, float)
    return points


def calc1(l, w):
    points = calcPoints(l)
    R1 = R2 = w*l/2
    M1 = w*points*(l-points)/2
    D1 = w*points*(l**3-2*l*points**2+points**3)/24
    return {'leftR': R1, 'M': M1, 'D': D1, 'rightR': R2}


def calc2(l, p, a):
    points = calcPoints(l)
    b = l-a
    R3 = p*b/l
    R4 = p*a/l
    leftPoints = points[points < a]
    M2L = p*b*leftPoints/l
    D2L = p*b*leftPoints*(l**2-b**2-leftPoints**2)/(6*l)

    rightPoints = points[points > a]
    M2R = p*a/l*(l-rightPoints)
    D2R = p*a*(l-rightPoints)*(l**2-a**2-(l-rightPoints)**2)/(6*l)

    M2 = np.concatenate((M2L, M2R))
    D2 = np.concatenate((D2L, D2R))
    return {'leftR': R3, 'M': M2, "D": D2, 'rightR': R4}


def calc3(l, w):
    points = calcPoints(l)
    R5 = w*l/6
    R6 = w*l/3
    M3 = w*points*(l**2-points**2)/(6*l)
    D3 = w*points*l/2*(3*points**4-10*l**2*points**2+7*l**4)/(180*l**2)
    return {'leftR': R5, 'M': M3, 'D': D3, 'rightR': R6}


def calc4(l, w, d, c):
    points = calcPoints(l)
    b = l-d-c/2
    a = l-b
    R7 = w*c*b/l
    R8 = w*c*a/l

    leftPoints = points[points < d]
    midPoints = points[np.logical_and(points >= d, points <= c+d)]
    rightPoints = points[points > c+d]

    M4left = w*c*b*leftPoints/l
    D4left = (w*c*b*(4*l-4*b**2/l-c**2/l)*leftPoints-4*leftPoints**3)/24

    M4mid = w*c*b/l*midPoints-w*(midPoints-d)**2/2
    D4mid = (w*c*b*(4*l-4*b**2/l-c**2/l) * midPoints -
             4*midPoints**3/l+(midPoints-d)**4/(b*c))/24

    M4right = w*c*a*(1-rightPoints/l)
    D4right = w*c*(4*b*(l-b**2/l)*rightPoints-4*b*rightPoints **
                   3/l+4*(rightPoints-a)**3-a*c**2*(1-rightPoints/l))/24

    M4 = np.concatenate((M4left, M4mid, M4right))
    D4 = np.concatenate((D4left, D4mid, D4right))
    return {'leftR': R7, 'M': M4, 'D': D4, 'rightR': R8}


def runCalc(loadings):
    return [
        calc1(BeamLength, loading['w']) if loading['type'] == 1
        else calc2(BeamLength, loading['p'], loading['l1']) if loading['type'] == 2
        else calc3(BeamLength, loading['w']) if loading['type'] == 3
        else calc4(BeamLength, loading['w'], loading['l1'], loading['l2']) if loading['type'] == 4
        else print("输入错误 type="+loading['type'])
        for loading in loadings
    ]


def runSum(calcResults):
    leftR = sum([calcResult['leftR'] for calcResult in calcResults])
    M = sum([calcResult['M'] for calcResult in calcResults])
    D = sum([calcResult['D'] for calcResult in calcResults])
    rightR = sum([calcResult['rightR'] for calcResult in calcResults])
    return {'leftR': leftR, 'M': M, 'D': D, 'rightR': rightR}


def runMax(length, sumResults):
    unit = length / 10
    maxM = np.max(sumResults['M'])
    maxD = np.max(sumResults['D'])
    maxMIndex = np.where(sumResults['M'] == maxM)
    maxMLocation = maxMIndex[0][0]*unit
    maxDIndex = np.where(sumResults['D'] == maxD)
    maxDLocation = maxDIndex[0][0]*unit
    return {
        'beamName': BeamName+'--'+str(BeamNum),
        'L': BeamLength,
        'loadings': loadings,
        'R1': sumResults['leftR'],
        'R2': sumResults['rightR'],
        'M': {
            'max': maxM,
            'aleft': maxMLocation
        },
        'D': {
            'max': maxD,
            'aleft': maxDLocation
        }
    }


if __name__ == '__main__':
    # Execute calcuations on input
    totals = runSum(runCalc(loadings))
    maxResults = runMax(BeamLength, totals)

    # Output
    print(json.dumps(maxResults, indent=2))
