// ============================================================
//  MUSICA E SUONI (AudioManager)
//  Musica di sottofondo, suono d'ambiente e volume degli effetti.
//
//  DOVE SI METTE
//    E' gia' dentro PF_Kit_GameManager. Basta compilare i campi.
//
//  COSA CONFIGURARE (nell'Inspector)
//    Music: il file audio della musica (in loop).
//    Ambient: il suono d'ambiente (in loop).
//    Music Volume, Ambient Volume, Sfx Volume: i volumi da 0 a 1.
//    Max Sfx: quanti effetti suonano insieme.
//
//  COME SI COLLEGA
//    Gli altri pezzi del kit lo usano da soli per i loro suoni.
//    Da un evento: AudioManager > PlayMusic / PlayAmbient / PlaySound.
//
//  ESEMPIO
//    Trascina un file audio nel campo Music: la musica parte con Play.
// ============================================================
using System.Collections.Generic;
using UnityEngine;

/// <summary>Musica, ambient ed effetti sonori con volumi regolabili. Sta nel prefab PF_Kit_GameManager; senza di lui i componenti suonano comunque.</summary>
public class AudioManager : MonoBehaviour
{
    public static AudioManager Instance { get; private set; }

    [Tooltip("Musica di sottofondo in loop")] public AudioClip music;
    [Tooltip("Suono d'ambiente in loop")] public AudioClip ambient;
    [Tooltip("Volume della musica")] [Range(0, 1)] public float musicVolume = 0.25f;
    [Tooltip("Volume del suono d'ambiente")] [Range(0, 1)] public float ambientVolume = 0.35f;
    [Tooltip("Volume degli effetti")] [Range(0, 1)] public float sfxVolume = 1f;
    [Tooltip("Quanti effetti possono suonare insieme")] [Min(1)] public int maxSfx = 8;

    AudioSource musicSource, ambientSource;
    readonly List<AudioSource> sfx = new List<AudioSource>();

    void Awake()
    {
        if (Instance && Instance != this) Debug.LogWarning("Ci sono due AudioManager nella scena: ne serve uno solo.", this);
        Instance = this;
        musicSource = NewSource("Musica", true); ambientSource = NewSource("Ambiente", true);
    }

    void OnDestroy() { if (Instance == this) Instance = null; }

    void Start()
    {
        if (music) PlayMusic(music);
        if (ambient) PlayAmbient(ambient);
    }

    AudioSource NewSource(string name, bool loop)
    {
        var go = new GameObject(name); go.transform.SetParent(transform, false);
        var s = go.AddComponent<AudioSource>(); s.loop = loop; s.playOnAwake = false; s.spatialBlend = 0f;
        return s;
    }

    /// <summary>Suona un effetto una volta. Se position e' null il suono e' 2D.</summary>
    public void PlaySfx(AudioClip clip, Vector3? position = null)
    {
        if (!clip) return;
        var s = sfx.Find(x => !x.isPlaying);
        if (!s)
        {
            if (sfx.Count >= maxSfx) s = sfx[0];
            else { s = NewSource("Effetto" + sfx.Count, false); sfx.Add(s); }
        }
        s.transform.position = position ?? transform.position;
        s.spatialBlend = position.HasValue ? 1f : 0f;
        s.volume = sfxVolume; s.clip = clip; s.Play();
    }

    /// <summary>Suona un effetto 2D. Versione da collegare a un UnityEvent.</summary>
    public void PlaySound(AudioClip clip) => PlaySfx(clip);

    /// <summary>Cambia la musica (null = silenzio).</summary>
    public void PlayMusic(AudioClip clip) => Loop(musicSource, clip, musicVolume);

    /// <summary>Cambia il suono d'ambiente (null = silenzio).</summary>
    public void PlayAmbient(AudioClip clip) => Loop(ambientSource, clip, ambientVolume);

    static void Loop(AudioSource s, AudioClip clip, float volume)
    {
        s.clip = clip; s.volume = volume; s.loop = true;
        if (clip) s.Play(); else s.Stop();
    }
}
