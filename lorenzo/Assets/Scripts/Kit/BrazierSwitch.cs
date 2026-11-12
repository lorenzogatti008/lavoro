// ============================================================
//  BRACIERE (BrazierSwitch)
//  Un braciere o una torcia che si accende: mostra il fuoco e il crepitio.
//
//  DOVE SI METTE
//    Trascina PF_Kit_Braciere. Di solito ha gia' un Interactable per accenderlo con E.
//
//  COSA CONFIGURARE (nell'Inspector)
//    Fire: l'oggetto del fuoco (effetto e luce), nascosto finche' non si accende.
//    Ignite Clip: il suono di accensione. Crackle: il suono in loop del fuoco acceso.
//    Start Lit: spunta se parte gia' acceso.
//
//  COME SI COLLEGA
//    Nell'Interactable: On Interact > + > braciere > BrazierSwitch > Light.
//    On Lit / On Extinguished: cosa succede quando si accende o si spegne.
//
//  ESEMPIO
//    Su un Interactable: On Interact > BrazierSwitch.Light.
// ============================================================
using UnityEngine;
using UnityEngine.Events;

/// <summary>Braciere (o torcia) che si accende: mostra il fuoco, avvia il crepitio. Collegalo a Interactable.onInteract -> Light.</summary>
public class BrazierSwitch : MonoBehaviour
{
    [Tooltip("Oggetto del fuoco (VFX e luce), nascosto finche' non si accende")] public GameObject fire;
    [Tooltip("Suono di accensione")] public AudioClip igniteClip;
    [Tooltip("Audio in loop del fuoco acceso (facoltativo)")] public AudioSource crackle;
    [Tooltip("Se attivo, parte gia' acceso")] public bool startLit;
    [Tooltip("Cosa succede quando si accende")] public UnityEvent onLit = new UnityEvent();
    [Tooltip("Cosa succede quando si spegne")] public UnityEvent onExtinguished = new UnityEvent();

    bool lit;
    public bool IsLit => lit;

    void Start()
    {
        if (fire) fire.SetActive(startLit);
        if (startLit) { lit = true; if (crackle) crackle.Play(); }
    }

    public void Light()
    {
        if (lit) return;
        lit = true;
        if (fire) fire.SetActive(true);
        if (crackle) crackle.Play();
        KitAudio.Play(igniteClip, transform.position);
        onLit.Invoke();
    }

    /// <summary>Spegne il braciere; si puo' riaccendere con E (la usa la sequenza dei bracieri).</summary>
    public void Extinguish()
    {
        if (!lit) return;
        lit = false;
        if (fire) fire.SetActive(false);
        if (crackle) crackle.Stop();
        var it = GetComponent<Interactable>(); if (it) it.ResetUse();
        onExtinguished.Invoke();
    }
}
