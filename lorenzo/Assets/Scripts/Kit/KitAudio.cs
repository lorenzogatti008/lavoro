// ============================================================
//  SUONI DEL KIT (KitAudio)
//  Un piccolo aiuto interno: fa suonare un effetto passando dall'AudioManager.
//
//  DOVE SI METTE
//    Non si aggiunge a niente: lo usano gli altri script del kit.
//
//  COSA CONFIGURARE (nell'Inspector)
//    Niente da configurare.
//
//  COME SI COLLEGA
//    Niente da collegare.
//
//  ESEMPIO
//    Non devi usarlo: i campi "Clip" degli altri pezzi lo usano da soli.
// ============================================================
using UnityEngine;

/// <summary>Suoni del kit: passano dall'AudioManager se c'e' in scena, altrimenti da PlayClipAtPoint.</summary>
public static class KitAudio
{
    /// <summary>Suona un effetto. Senza posizione il suono e' 2D (vicino alla camera).</summary>
    public static void Play(AudioClip clip, Vector3? position = null, float volume = 1f)
    {
        if (!clip) return;
        if (AudioManager.Instance) { AudioManager.Instance.PlaySfx(clip, position); return; }
        var at = position ?? (Camera.main ? Camera.main.transform.position : Vector3.zero);
        AudioSource.PlayClipAtPoint(clip, at, volume);
    }
}
