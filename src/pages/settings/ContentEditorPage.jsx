import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import LinkIcon from '@mui/icons-material/Link'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import PublishIcon from '@mui/icons-material/Publish'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import toast from 'react-hot-toast'
import api from '../../api/axiosInstance'

const EMPTY_CONTENT = '<h2>Start writing here</h2><p>Add your content...</p>'

const toolbarActions = [
  ['Bold', 'bold', <FormatBoldIcon key="bold" />],
  ['Italic', 'italic', <FormatItalicIcon key="italic" />],
  ['Underline', 'underline', <FormatUnderlinedIcon key="underline" />],
  ['Bulleted list', 'insertUnorderedList', <FormatListBulletedIcon key="bullets" />],
  ['Numbered list', 'insertOrderedList', <FormatListNumberedIcon key="numbers" />],
  ['Align left', 'justifyLeft', <FormatAlignLeftIcon key="left" />],
  ['Align center', 'justifyCenter', <FormatAlignCenterIcon key="center" />],
  ['Align right', 'justifyRight', <FormatAlignRightIcon key="right" />],
  ['Undo', 'undo', <UndoIcon key="undo" />],
  ['Redo', 'redo', <RedoIcon key="redo" />],
]

export default function ContentEditorPage({ title, contentType }) {
  const editorRef = useRef(null)
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [preview, setPreview] = useState(false)
  const [updatedAt, setUpdatedAt] = useState('')
  const draftKey = `app-content-draft-${contentType}`

  const setEditorContent = useCallback((value) => {
    const next = value || EMPTY_CONTENT
    setHtml(next)
    if (editorRef.current) editorRef.current.innerHTML = next
  }, [])

  useEffect(() => {
    let active = true
    const loadContent = async () => {
      try {
        setLoading(true)
        const response = await api.get('/content/getContent', {
          params: { type: contentType, lang: 'en' },
        })
        if (!active) return
        const body = response?.data?.responseBody
        const savedDraft = localStorage.getItem(draftKey)
        setEditorContent(savedDraft || body?.content || EMPTY_CONTENT)
        setUpdatedAt(body?.updatedAt || '')
      } catch (error) {
        if (!active) return
        const savedDraft = localStorage.getItem(draftKey)
        if (savedDraft) {
          setEditorContent(savedDraft)
        } else if (error?.response?.status === 404 || error?.response?.data?.responseCode === 404) {
          setEditorContent(EMPTY_CONTENT)
        } else {
          setEditorContent(EMPTY_CONTENT)
          toast.error(error?.response?.data?.message || 'Unable to load content')
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    loadContent()
    return () => { active = false }
  }, [contentType, draftKey, setEditorContent])

  const runCommand = (command, value = null) => {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    setHtml(editorRef.current?.innerHTML || '')
  }

  const addLink = () => {
    const url = window.prompt('Enter the link URL')
    if (url) runCommand('createLink', url)
  }

  const saveDraft = () => {
    const currentHtml = editorRef.current?.innerHTML || html
    localStorage.setItem(draftKey, currentHtml)
    setHtml(currentHtml)
    toast.success('Draft saved on this device')
  }

  const publishContent = async () => {
    const currentHtml = editorRef.current?.innerHTML || html
    if (!currentHtml.replace(/<[^>]*>/g, '').trim()) {
      toast.error('Please add content before publishing')
      return
    }
    try {
      setPublishing(true)
      const response = await api.post('/content/updateContent', {
        type: contentType,
        lang: 'en',
        content: currentHtml,
      })
      if (response?.data?.responseCode !== 200) {
        throw new Error(response?.data?.message || 'Unable to publish content')
      }
      localStorage.removeItem(draftKey)
      setHtml(response?.data?.responseBody?.content || currentHtml)
      setUpdatedAt(response?.data?.responseBody?.updatedAt || '')
      toast.success(`${title} published successfully`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Unable to publish content')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'flex-start' }} spacing={2} sx={{ mb: 2.5, width: '100%', minHeight: { md: 54 } }}>
        <Box>
          <Typography sx={{ fontSize: 26, fontWeight: 900, color: '#111827' }}>{title}</Typography>
          <Typography sx={{ fontSize: 13, color: '#64748B', mt: 0.4 }}>
            Create and publish the HTML content displayed in the mobile app.
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={1.2}
          alignItems="center"
          justifyContent="flex-end"
          sx={{
            flexWrap: 'wrap',
            rowGap: 1,
            alignSelf: 'flex-end',
            ml: 'auto',
            position: { xs: 'static', md: 'fixed' },
            top: { md: 84 },
            right: { md: 24 },
            zIndex: { md: 1200 },
            p: { md: 0.75 },
            borderRadius: { md: 3 },
            bgcolor: { md: 'rgba(245,245,245,0.94)' },
            backdropFilter: { md: 'blur(10px)' },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<SaveOutlinedIcon />}
            onClick={saveDraft}
            disabled={loading}
            sx={{ borderRadius: 2.5, px: 2, py: 1, fontWeight: 700, textTransform: 'none', color: '#334155', borderColor: '#CBD5E1', bgcolor: '#FFFFFF', boxShadow: '0 4px 12px rgba(15,23,42,0.05)', '&:hover': { borderColor: '#94A3B8', bgcolor: '#F8FAFC', boxShadow: '0 6px 16px rgba(15,23,42,0.09)' } }}
          >
            Save Draft
          </Button>
          <Button
            variant="outlined"
            startIcon={<VisibilityOutlinedIcon />}
            onClick={() => setPreview((value) => !value)}
            disabled={loading}
            sx={{ borderRadius: 2.5, px: 2, py: 1, fontWeight: 700, textTransform: 'none', color: '#7A1E1E', borderColor: '#E7B8B8', bgcolor: '#FFF7F7', boxShadow: '0 4px 12px rgba(122,30,30,0.06)', '&:hover': { borderColor: '#7A1E1E', bgcolor: '#FEECEC', boxShadow: '0 6px 16px rgba(122,30,30,0.12)' } }}
          >
            {preview ? 'Edit' : 'Preview'}
          </Button>
          <Button
            variant="contained"
            startIcon={publishing ? <CircularProgress size={17} color="inherit" /> : <PublishIcon />}
            onClick={publishContent}
            disabled={loading || publishing}
            sx={{ borderRadius: 2.5, px: 2.4, py: 1, fontWeight: 800, textTransform: 'none', bgcolor: '#7A1E1E', boxShadow: '0 8px 18px rgba(122,30,30,0.24)', '&:hover': { bgcolor: '#5F1717', boxShadow: '0 10px 24px rgba(122,30,30,0.32)', transform: 'translateY(-1px)' }, transition: 'all 0.2s ease' }}
          >
            Publish
          </Button>
        </Stack>
      </Stack>

      <Alert severity="info" sx={{ mb: 2 }}>
        Publish saves formatted HTML through the app-content API. Contact Us uses the backend’s existing About Us content slot.
      </Alert>

      <Card sx={{ borderRadius: 3, border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(15,23,42,0.06)' }}>
        {loading ? (
          <Box sx={{ minHeight: 420, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
        ) : preview ? (
          <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#F8FAFC' }}>
            <Box component="iframe" title={`${title} preview`} sandbox="" srcDoc={`<!doctype html><html><head><style>body{font-family:Arial,sans-serif;line-height:1.65;color:#1f2937;padding:28px;max-width:850px;margin:auto}img{max-width:100%}a{color:#7A1E1E}</style></head><body>${html}</body></html>`} sx={{ width: '100%', minHeight: 560, border: '1px solid #E5E7EB', borderRadius: 2, bgcolor: '#fff' }} />
          </Box>
        ) : (
          <>
            <Box sx={{ px: 2, py: 1.2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.4, bgcolor: '#F8FAFC' }}>
              <select aria-label="Text style" defaultValue="p" onChange={(event) => runCommand('formatBlock', event.target.value)} style={{ height: 34, border: '1px solid #CBD5E1', borderRadius: 6, padding: '0 8px', background: '#fff' }}>
                <option value="p">Normal text</option><option value="h1">Heading 1</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="blockquote">Quote</option>
              </select>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.6 }} />
              {toolbarActions.map(([label, command, icon]) => (
                <Tooltip title={label} key={command}><IconButton size="small" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand(command)}>{icon}</IconButton></Tooltip>
              ))}
              <Tooltip title="Add link"><IconButton size="small" onMouseDown={(event) => event.preventDefault()} onClick={addLink}><LinkIcon /></IconButton></Tooltip>
            </Box>
            <Divider />
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
              <Box ref={editorRef} contentEditable suppressContentEditableWarning onInput={(event) => setHtml(event.currentTarget.innerHTML)} sx={{ minHeight: 500, p: { xs: 2.5, md: 4 }, outline: 'none', bgcolor: '#fff', lineHeight: 1.7, color: '#1F2937', '& h1': { fontSize: 32 }, '& h2': { fontSize: 25 }, '& h3': { fontSize: 20 }, '& blockquote': { borderLeft: '4px solid #7A1E1E', pl: 2, color: '#64748B' }, '& a': { color: '#7A1E1E' } }} />
            </CardContent>
          </>
        )}
      </Card>
      {updatedAt && <Typography sx={{ mt: 1.5, fontSize: 12, color: '#64748B', textAlign: 'right' }}>Last published: {updatedAt}</Typography>}
    </Box>
  )
}
