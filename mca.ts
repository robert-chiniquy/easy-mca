import { SVD } from 'svd-js'
    
export interface MCAOptions {
    correction:boolean
    epsilon:number
    tolerance:number
}

type MCARow<Categories extends {
    [Name:string|symbol|number]:[...unknown[]]
}> = {
    [Name in keyof Categories]:Categories[Name][number]
}

function invSqrt (x:number) {
    if (x > 1e-6) {
        return 1 / Math.sqrt(x)
    }
    return 0
}

function transpose (x:number[][]) {
    const result:number[][] = []
    for (let i = 0; i < x[0].length; ++i) {
        const row:number[] = []
        for (let j = 0; j < x.length; ++j) {
            row.push(x[j][i])
        }
        result.push(row)
    }
    return result
}

// svd-js is annoying and doesn't work with wide matrices.  have to transpose then invert transpose
function reallyDoTheSVD (A:number[][], epsilon:number) {
    if (A[0].length <= A.length) {
        return SVD(A, true, true, epsilon)
    }
    const { u, q, v } = SVD(transpose(A), true, true, epsilon)
    return {
        u: transpose(v),
        q,
        v: transpose(u)
    }
}

export function MCA<
    Categories extends {
        [Variable:string|symbol|number]:[...unknown[]]
    }> (
        rows:Partial<MCARow<Categories>>[],
        categories:Categories,
        options?:Partial<MCAOptions>) {
    // first unpack categories
    const columnKeys:(keyof Categories)[] = []
    const columnCategories:any[][] = []
    let columnDimension = 0
    Object.keys(categories).forEach((key) => {
        const cats = categories[key]
        if (Array.isArray(cats) && cats.length > 0) {
            columnKeys.push(key)
            columnCategories.push(cats)
            columnDimension += cats.length
        }
    })

    // construct indicator matrix
    // takes each category variable and unpacks it into multiple columns
    // missing variables get average value for each column
    // in the future could add fancier stuff here
    const rowDimension = rows.length
    let totalCount = 0
    const Z = rows.map((obj) => {
        const row = []
        for (let i = 0; i < columnKeys.length; ++i) {
            const key = columnKeys[i]
            const cats = columnCategories[i]
            if (key in obj) {
                const v = obj[key]
                for (let j = 0; j < cats.length; ++j) {
                    if (cats[j] === v) {
                        row.push(1)
                        totalCount += 1
                    } else {
                        row.push(0)
                    }
                }
            } else {
                for (let j = 0; j < cats.length; ++j) {
                    row.push(1 / cats.length)
                }
                totalCount += 1
            }
        }
        return row
    })

    // normalize matrix and compute row/column sums
    const D_r = new Array(rowDimension).fill(0)
    const D_c = new Array(columnDimension).fill(0)
    const scale = 1 / totalCount
    for (let i = 0; i < rowDimension; ++i) {
        for (let j = 0; j < columnDimension; ++j) {
            const v = (Z[i][j] *= scale)
            D_r[i] += v
            D_c[j] += v
        }
    }

    // compute normalized residual matrix
    const D_invR = D_r.map(invSqrt)
    const D_invC = D_c.map(invSqrt)
    for (let i = 0; i < rowDimension; ++i) {
        for (let j = 0; j < columnDimension; ++j) {
            Z[i][j] = D_invR[i] * D_invC[j] * (Z[i][j] - D_r[i] * D_c[j])
        }
    }

    // run svd
    const epsilon = options?.epsilon || 0
    const { u: P, q: s } = reallyDoTheSVD(Z, epsilon)

    // run correction on eigenvalues
    const correction = options?.correction
    const K = columnKeys.length
    let E:number[]
    if (correction) {
        E = s.map(lambda => {
            if (lambda < 1 / K) {
                return 0
            }
            return Math.pow(K / (K - 1) * (lambda - 1 / K), 2)
        })
    } else {
        E = s.map(x => Math.pow(x, 2))
    }

    // compute rank and inertia
    let inertia = 0
    let rank = 0
    const tolerance = options?.tolerance || 1e-4
    for (let i = 0; i < E.length; ++i) {
        inertia += E[i]
        if (E[i] > tolerance) {
            rank += 1
        }
    }
    if (!rank) {
        rank = E.length
    }

    // trim to smaller eigen vectors
    const L = E.slice(0, rank)

    // calculate explained variance
    const explainedVariance = L.map(x => x / inertia)

    // calculate projection onto factor space
    let S = L
    if (correction) {
        S = L.map((x) => -Math.sqrt(x))
    }
    const factorScores = D_r.map((dr, i) => {
        return S.map((lambda, j) => {
            return dr * lambda * P[i][j] 
        })
    })

    return {
        factorScores,
        explainedVariance,
    }
}