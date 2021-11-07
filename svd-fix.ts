// helper functions to work around quirks in SVD-js
import { SVD } from 'svd-js'

// transpose an array-of-arrays type matrix
export function transpose (x:number[][]) {
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

// apply a permutation to a matrix
function permute<T> (x:T[], perm:number[]) {
    return x.map((_, i) => x[perm[i]])
}

// SVD js has a bug and only works on long (not wide) matrices
// have to transpose inputs in case where there are more columns than rows :|
function runSVD (A:number[][], epsilon:number) {
    if (A[0].length <= A.length) {
        const {u, q, v} = SVD(A, true, true, epsilon)
        return {
            u: transpose(u), 
            q,
            v
        }
    }
    const { u, q, v } = SVD(transpose(A), true, true, epsilon)
    return {
        u: v,
        q,
        v: transpose(u)
    }
}

function isSorted (x:number[]) {
    for (let i = 1; i < x.length; ++i) {
        if (Math.abs(x[i - 1]) < Math.abs(x[i])) {
            return false
        }
    }
    return true
}

function formatMatrix (M:number[][], tol:number) {
    const precision = Math.max(0, -Math.ceil(Math.log10(tol)))
    return `[${M.map((r) => `[${r.map(x => x.toFixed(precision)).join(', ')}]`).join(',\n  ')}]`
}

function checkNan (x:number[][]) {
    for (let i = 0; i < x.length; ++i) {
        for (let j = 0; j < x[i].length; ++j) {
            if (isNaN(x[i][j])) {
                throw new Error('SVD.js failed, NaN output')
            }
        }
    }
}

function checkSVD (expected:number[][], P:number[][], s:number[], Q:number[][], tolerance:number) {
    checkNan(P)
    checkNan([s])
    checkNan(Q)

    const actual:number[][] = []
    for (let i = 0; i < P.length; ++i) {
        const row:number[] = []
        for (let j = 0; j < Q[0].length; ++j) {
            let v = 0
            for (let k = 0; k < s.length; ++k) {
                v += P[i][k] * s[k] * Q[k][j]
            }
            row.push(v)
        }
        actual.push(row)
    }

    for (let i = 0; i < expected.length; ++i) {
        for (let j = 0; j < expected[i].length; ++j) {
            if (Math.abs(expected[i][j] - actual[i][j]) > tolerance) {
                console.error(`Catastrophic failure in SVD-js subroutine.\nExpected Z=\n ${formatMatrix(expected, tolerance)}\nActual P*s*Q=\n ${formatMatrix(actual, tolerance)}`)
                throw new Error(`SVD computation failed.  Expected: ${expected[i][j]}, got: ${actual[i][j]} for entry ${i}, ${j}.  This could be a bug in SVD.js`)
            }        
        }
    }
}

export function fixedSVD (A:number[][], epsilon:number, checkFactor:number) {
    const { u, q, v } = runSVD(A, epsilon)
    
    // SVD js does not always return singular values in sorted order, so we need to permute the rows and columns
    // after sorting singular values
    let s = q
    let P = u
    let Q = v
    if (!isSorted(q)) {
        const sortedEigs = q.map((x, i) => [x, i]).sort((a, b) =>
            Math.abs(b[0]) - Math.abs(a[0])
        )
        const perm = sortedEigs.map(p => p[1])
        s = sortedEigs.map(p => p[0])
        P = transpose(permute(transpose(u), perm))
        Q = permute(v, perm)
    }

    // sometimes SVD-js blows up for mysterious reasons.  If we pass in a check tolerance then we should check output from SVD-js and report an error
    if (checkFactor > 0) {
        checkSVD(A, P, s, Q, checkFactor)
    }

    return {
        P,
        s, 
        Q,
    }    
}
