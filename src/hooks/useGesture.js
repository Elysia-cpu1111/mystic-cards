import { useEffect, useRef, useState, useCallback } from 'react'
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision'

export default function useGesture() {
  const videoRef = useRef(null)
  const recognizerRef = useRef(null)
  const streamRef = useRef(null)
  const animFrameRef = useRef(null)
  const gestureHistory = useRef([])
  const mountedRef = useRef(true)

  const [gesture, setGesture] = useState('None')
  const [gestureLabel, setGestureLabel] = useState('...')
  const [phase, setPhase] = useState('loading')
  const [error, setError] = useState(null)

  // Phase 1: 加载模型
  useEffect(() => {
    mountedRef.current = true
    async function loadModel() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
        )
        recognizerRef.current = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        })
        if (mountedRef.current) setPhase('ready')
      } catch (err) {
        console.error('Model load error:', err)
        if (mountedRef.current) {
          setError(err.message || '模型加载失败')
          setPhase('error')
        }
      }
    }
    loadModel()
    return () => { mountedRef.current = false }
  }, [])

  // Phase 2: 开启摄像头
  const startCamera = useCallback(async () => {
    try {
      setPhase('loading')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      })
      streamRef.current = stream
      const video = document.createElement('video')
      video.srcObject = stream
      video.playsInline = true
      video.muted = true
      await video.play()
      videoRef.current = video
      if (!mountedRef.current) return
      setPhase('active')
      startRecognitionLoop(video)
    } catch (err) {
      console.error('Camera error:', err)
      if (mountedRef.current) {
        setError(err.message || '摄像头启动失败')
        setPhase('error')
      }
    }
  }, [])

  function startRecognitionLoop(video) {
    let lastTick = 0

    function loop(now) {
      if (!mountedRef.current) return
      animFrameRef.current = requestAnimationFrame(loop)
      if (now - lastTick < 60) return
      lastTick = now
      if (!recognizerRef.current || video.readyState < 2) return

      try {
        const results = recognizerRef.current.recognizeForVideo(video, performance.now())

        // 手势分类 + 防抖投票
        if (results.gestures.length > 0 && results.gestures[0].length > 0) {
          const g = results.gestures[0][0]
          gestureHistory.current.push({ cat: g.categoryName, score: g.score })
        } else {
          gestureHistory.current.push({ cat: 'None', score: 0 })
        }

        if (gestureHistory.current.length > 5) gestureHistory.current.shift()

        const votes = {}
        gestureHistory.current.forEach(h => {
          votes[h.cat] = (votes[h.cat] || 0) + 1
        })
        const entries = Object.entries(votes).sort((a, b) => b[1] - a[1])
        const winner = entries[0]
        const winnerName = winner[0]
        const voteCount = winner[1]

        if (voteCount >= 2 && winnerName !== 'None') {
          setGesture(winnerName)
          setGestureLabel(GESTURE_LABELS[winnerName] || winnerName)
        } else {
          setGesture('None')
          setGestureLabel('...')
        }
      } catch {
        // ignore
      }
    }

    animFrameRef.current = requestAnimationFrame(loop)
  }

  // 清理
  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    }
  }, [])

  return { gesture, gestureLabel, phase, error, videoRef, startCamera }
}

const GESTURE_LABELS = {
  Open_Palm: '✋ 张开',
  Closed_Fist: '✊ 握拳',
  Thumb_Up: '👍',
  Victory: '✌️',
  ILoveYou: '🤟',
  Pointing_Up: '☝️',
  None: '...',
}
